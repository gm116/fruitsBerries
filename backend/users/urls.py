from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView

from . import views
from .views import check_token, get_user_profile, leave_review

urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('activity-feed/', views.get_activity_feed, name='activity_feed'),
    path('check-token/', check_token),
    path('profile/', get_user_profile, name='user-profile'),
    path('leave-review/', leave_review, name='leave-review'),
    path('events/', views.get_all_events, name='get-all-events'),
    path('events/create/', views.create_event, name='create-event'),
    path('events/<int:event_id>/join/', views.join_event, name='join-event'),
    path('events/<int:event_id>/delete/', views.delete_event, name='delete-event'),
    path('events/<int:event_id>/leave/', views.leave_event, name='leave-event'),
    path('profile/update/', views.update_profile, name='update-profile'),
    path('profile/change-password/', views.change_password, name='change-password'),
]
