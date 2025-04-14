from rest_framework import serializers
from .models import Species, Plant, Region


class TreeSpeciesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Species
        fields = ['id', 'name', 'description', 'image_url']


class PlantSerializer(serializers.ModelSerializer):
    species_name = serializers.CharField(source="species.category", read_only=True)
    species_title = serializers.CharField(source="species.name", read_only=True)

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
        read_only_fields = ['id', 'created_at', 'user']

    def to_representation(self, instance):
        from users.serializers import UserSerializer
        rep = super().to_representation(instance)
        rep['user'] = UserSerializer(instance.user).data
        return rep


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = ['id', 'gid_0', 'gid_1', 'name', 'geometry']