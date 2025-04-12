from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView

from . import views
from .views import check_token

urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('activity-feed/', views.get_activity_feed, name='activity_feed'),
    path('check-token/', check_token),
]
