from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Species(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    image_url = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name


class Plant(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    species = models.ForeignKey(Species, on_delete=models.CASCADE)
    latitude = models.FloatField()
    longitude = models.FloatField()
    image_url = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name
