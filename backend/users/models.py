from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from datetime import timedelta


def user_avatar_path(instance, filename):
    return f"avatars/user_{instance.id}/{filename}"


class User(AbstractUser):
    email = models.EmailField(max_length=254, unique=True)
    registration_date = models.DateTimeField(auto_now_add=True)

    profile_picture = models.ImageField(
        upload_to=user_avatar_path,
        blank=True,
        null=True,
        default="avatars/default_avatar.png"
    )

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.username


class Achievement(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    condition = models.CharField(max_length=255)  # Тип условия (например, "add_10_trees")
    threshold = models.IntegerField(default=1)  # Количество действий для выполнения

    def __str__(self):
        return self.name


class UserAchievement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    progress = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'achievement')

    def __str__(self):
        return f"{self.user.username} - {self.achievement.name} ({'Завершено' if self.completed else 'В процессе'})"


class ActivityLog(models.Model):
    action = models.CharField(max_length=255)
    action_date = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return f"Action: {self.action}, User: {self.user.name}, Date: {self.action_date}"


class Reviews(models.Model):
    from_user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="given_reviews", on_delete=models.CASCADE)
    to_user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="received_reviews", on_delete=models.CASCADE)
    is_positive = models.BooleanField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("from_user", "to_user")


class EcoEvent(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=255)
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    participants = models.ManyToManyField(User, related_name="participated_events")

    def save(self, *args, **kwargs):
        if not self.end_datetime:
            self.end_datetime = self.start_datetime + timedelta(days=1)
        super().save(*args, **kwargs)
