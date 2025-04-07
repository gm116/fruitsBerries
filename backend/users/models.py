from django.contrib.auth.models import AbstractUser
from django.db import models

from django.conf import settings


class User(AbstractUser):
    email = models.EmailField(max_length=254, unique=True)
    registration_date = models.DateTimeField(auto_now_add=True)
    profile_picture = models.CharField(blank=True, max_length=255, null=True)

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
