from rest_framework import serializers
from .models import Species, Plant


class TreeSpeciesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Species
        fields = ['id', 'name', 'description', 'image_url']


class PlantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plant
        fields = ['id', 'user', 'name', 'species', 'latitude', 'longitude', 'image_url']
