from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Species(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    image_url = models.CharField(max_length=255, blank=True, null=True)
    category = models.CharField(max_length=50, choices=[("tree", "Tree"), ("bush", "Bush")])

    def __str__(self):
        return self.name


class Plant(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    species = models.ForeignKey(Species, on_delete=models.CASCADE)
    latitude = models.FloatField()
    longitude = models.FloatField()
    image_url = models.CharField(max_length=255, blank=True, null=True)
    region = models.ForeignKey("Region", null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.name

class Region(models.Model):
    gid_0 = models.CharField(max_length=10)
    gid_1 = models.CharField(max_length=50)
    name = models.CharField(max_length=255)
    geometry = models.JSONField()

    def __str__(self):
        return self.name