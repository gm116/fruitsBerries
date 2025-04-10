from rest_framework import serializers
from .models import Species, Plant, Region


class TreeSpeciesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Species
        fields = ['id', 'name', 'description', 'image_url']


class PlantSerializer(serializers.ModelSerializer):
    species_name = serializers.CharField(source="species.category", read_only=True)
    class Meta:
        model = Plant
        fields = ['id', 'name', 'species_name', 'species', 'latitude', 'longitude', 'image_url']

class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = ['id', 'gid_0', 'gid_1', 'name', 'geometry']