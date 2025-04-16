from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User, Achievement, UserAchievement, ActivityLog, Reviews
from .serializers import UserSerializer, ActivityLogSerializer, PublicUserSerializer


@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if email and User.objects.filter(email=email).exists():
        return Response({"detail": "Email already exists."}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password)

    achievements = Achievement.objects.all()
    user_achievements = [
        UserAchievement(user=user, achievement=achievement, progress=0, completed=False)
        for achievement in achievements
    ]
    UserAchievement.objects.bulk_create(user_achievements)

    ActivityLog.objects.create(user=user, action=f"Зарегестрировался пользователь {username}")

    serializer = UserSerializer(user)
    return Response(serializer.data, status=201)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['name'] = user.name
        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if user:
        user.last_login = now()
        user.save(update_fields=['last_login'])
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_200_OK)

    return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_activity_feed(request):
    activities = ActivityLog.objects.all().order_by('-action_date')[:5]
    serializer = ActivityLogSerializer(activities, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_token(request):
    return Response({"detail": "Token is valid"}, status=200)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_profile(request):
    user_id = request.query_params.get('user_id')

    if user_id:
        user = get_object_or_404(User, id=user_id)
    elif request.user.is_authenticated:
        user = request.user
    else:
        return Response({"detail": "Не авторизован"}, status=status.HTTP_401_UNAUTHORIZED)

    serializer = PublicUserSerializer(user, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def leave_review(request):
    to_user_id = request.data.get("to_user")
    is_positive = request.data.get("is_positive")
    comment = request.data.get("comment", "").strip()

    if to_user_id is None or is_positive is None:
        return Response({"detail": "Недостаточно данных для создания отзыва."}, status=400)

    if str(request.user.id) == str(to_user_id):
        return Response({"detail": "Нельзя оставить отзыв самому себе."}, status=400)

    to_user = get_object_or_404(User, id=to_user_id)

    if Reviews.objects.filter(from_user=request.user, to_user=to_user).exists():
        return Response({"detail": "Вы уже оставили отзыв этому пользователю."}, status=400)

    Reviews.objects.create(
        from_user=request.user,
        to_user=to_user,
        is_positive=bool(is_positive),
        comment=comment
    )

    return Response({"detail": "Отзыв успешно добавлен."}, status=201)