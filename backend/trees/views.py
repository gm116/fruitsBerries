from .serializers import PlantSerializer
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from users.models import Achievement, UserAchievement


@api_view(['POST'])
def add_plant(request):
    if request.method == 'POST':
        user = request.user  # предполагается, что пользователь авторизован
        request.data['user'] = user.id

        serializer = PlantSerializer(data=request.data)
        if serializer.is_valid():
            plant = serializer.save()

            # Логика проверки достижений
            check_achievements(user)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def check_achievements(user):
    achievements = Achievement.objects.all()

    for achievement in achievements:
        user_achievement, created = UserAchievement.objects.get_or_create(
            user=user, achievement=achievement)

        if not user_achievement.completed:
            if achievement.condition == "add_10_trees":
                user_achievement.progress += 1
                if user_achievement.progress >= achievement.threshold:
                    user_achievement.completed = True
                    user_achievement.save()
            # Можно добавить другие условия для разных ачивокEST)