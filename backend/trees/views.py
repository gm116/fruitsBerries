from .models import Plant
from .serializers import PlantSerializer
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from users.models import Achievement, UserAchievement


@api_view(['POST'])
def add_plant(request):
    if request.method == 'POST':
        user = request.user
        request.data['user'] = user.id

        serializer = PlantSerializer(data=request.data)
        if serializer.is_valid():
            plant = serializer.save()
            check_achievements(user)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def check_achievements(user):
    user_achievements = UserAchievement.objects.filter(user=user)

    for user_achievement in user_achievements:
        achievement = user_achievement.achievement

        if not user_achievement.completed:
            if achievement.condition == "add_first_tree":
                user_achievement.progress = 1
            elif achievement.condition == "add_10_trees":
                user_achievement.progress += 1
            elif achievement.condition == "add_50_trees":
                user_achievement.progress += 1
            elif achievement.condition == "add_5_species":
                species_count = Plant.objects.filter(user=user).values("species").distinct().count()
                user_achievement.progress = species_count
            elif achievement.condition == "add_10_species":
                species_count = Plant.objects.filter(user=user).values("species").distinct().count()
                user_achievement.progress = species_count
            elif achievement.condition == "add_5_berry_bushes":
                berry_count = Plant.objects.filter(user=user, species__category="Bush").count()
                user_achievement.progress = berry_count
            elif achievement.condition == "add_10_locations":
                region_count = Plant.objects.filter(user=user).values("latitude", "longitude").distinct().count()
                user_achievement.progress = region_count

            if user_achievement.progress >= achievement.threshold:
                user_achievement.completed = True

    UserAchievement.objects.bulk_update(user_achievements, ["progress", "completed"])