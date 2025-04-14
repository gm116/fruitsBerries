from rest_framework import serializers
from .models import User, Achievement, ActivityLog, UserAchievement
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


class PublicUserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(read_only=True)
    total_plants = serializers.SerializerMethodField()
    achievements = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'profile_picture', 'total_plants', 'achievements']

    def get_total_plants(self, obj):
        return Plant.objects.filter(user=obj).count()

    def get_achievements(self, obj):
        achievements = UserAchievement.objects.filter(user=obj, completed=True).select_related('achievement')
        return [
            {
                "id": ua.achievement.id,
                "name": ua.achievement.name,
                "description": ua.achievement.description
            }
            for ua in achievements
        ]