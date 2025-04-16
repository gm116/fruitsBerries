from rest_framework import serializers
from .models import User, Achievement, ActivityLog, UserAchievement, Reviews
from trees.models import Plant


class UserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(read_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'profile_picture']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'name', 'description']


class ActivityLogSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        from .serializers import UserSerializer
        rep = super().to_representation(instance)
        rep['user'] = UserSerializer(instance.user).data
        return rep

    class Meta:
        model = ActivityLog
        fields = ['id', 'action', 'action_date', 'user']


from .models import Reviews


class PublicUserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(read_only=True)
    total_plants = serializers.SerializerMethodField()
    achievements = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'profile_picture', 'total_plants', 'achievements', 'rating', 'reviews']

    def get_total_plants(self, obj):
        return Plant.objects.filter(user=obj).count()

    def get_achievements(self, obj):
        achievements = UserAchievement.objects.filter(user=obj, completed=True).select_related('achievement')
        return [
            {"id": ua.achievement.id, "name": ua.achievement.name, "description": ua.achievement.description}
            for ua in achievements
        ]

    def get_rating(self, obj):
        tree_count = Plant.objects.filter(user=obj).count()
        achievement_count = UserAchievement.objects.filter(user=obj, completed=True).count()
        good_reviews = Reviews.objects.filter(to_user=obj, is_positive=True).count()
        bad_reviews = Reviews.objects.filter(to_user=obj, is_positive=False).count()

        base_score = min((tree_count * 0.3) + (achievement_count * 0.5), 3)
        total_reviews = good_reviews + bad_reviews
        review_score = (good_reviews / total_reviews) * 2 if total_reviews > 0 else 0
        return round(base_score + review_score, 2)

    def get_reviews(self, obj):
        reviews = Reviews.objects.filter(to_user=obj).select_related("from_user").order_by("-created_at")
        return [
            {
                "id": r.id,
                "is_positive": r.is_positive,
                "comment": r.comment,
                "from_username": r.from_user.username
            } for r in reviews
        ]
