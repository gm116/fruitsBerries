from rest_framework import serializers
from .models import Species, Plant, Region


class TreeSpeciesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Species
        fields = ['id', 'name', 'description', 'image_url']


from .models import Seasonality


class PlantSerializer(serializers.ModelSerializer):
    species_name = serializers.CharField(source="species.category", read_only=True)
    species_title = serializers.CharField(source="species.name", read_only=True)
    icon_url = serializers.SerializerMethodField()
    fruiting_months = serializers.SerializerMethodField()

    class Meta:
        model = Plant
        fields = [
            'id', 'description', 'species_name', 'species_title', 'species',
            'latitude', 'longitude', 'image_url', 'created_at', 'user',
            'icon_url', 'fruiting_months'
        ]
        read_only_fields = ['id', 'created_at', 'user']

    def to_representation(self, instance):
        from users.serializers import UserSerializer
        rep = super().to_representation(instance)
        rep['user'] = UserSerializer(instance.user).data
        return rep

    def get_icon_url(self, obj):
        request = self.context.get("request")
        if obj.species and obj.species.image_url and request:
            return request.build_absolute_uri(f"/media/{obj.species.image_url}")
        return None

    def get_fruiting_months(self, obj):
        if obj.region and obj.species:
            season = Seasonality.objects.filter(region=obj.region, species=obj.species).first()
            if season and season.months:
                months_map = {
                    1: "январь", 2: "февраль", 3: "март", 4: "апрель", 5: "май", 6: "июнь",
                    7: "июль", 8: "август", 9: "сентябрь", 10: "октябрь", 11: "ноябрь", 12: "декабрь"
                }
                return [months_map.get(m, str(m)) for m in season.months]
        return []


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = ['id', 'gid_0', 'gid_1', 'name', 'geometry']
