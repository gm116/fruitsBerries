from rest_framework import serializers
from .models import Species, Plant, Region
from users.serializers import UserSerializer


class TreeSpeciesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Species
        fields = ['id', 'name', 'description', 'image_url']


class PlantSerializer(serializers.ModelSerializer):
    species_name = serializers.CharField(source="species.category", read_only=True)
    species_title = serializers.CharField(source="species.name", read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Plant
        fields = [
            'id',
            'description',
            'species_name',
            'species_title',
            'species',
            'latitude',
            'longitude',
            'image_url',
            'created_at',
            'user',
        ]


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = ['id', 'gid_0', 'gid_1', 'name', 'geometry']
