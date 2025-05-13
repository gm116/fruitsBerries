from .models import Plant, Species, Region, Seasonality
from .serializers import PlantSerializer, RegionSerializer
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
import os
from datetime import datetime
from django.conf import settings

from users.models import ActivityLog, Achievement, UserAchievement
from .utils import point_in_polygon, is_valid_plant_image

@api_view(['GET'])
def get_plants(request):
    plants = Plant.objects.all()
    serializer = PlantSerializer(plants, many=True, context={"request": request})
    return Response(serializer.data)

@api_view(['GET'])
def get_species(request):
    species = Species.objects.all().values("id", "name")
    return Response(species, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_plant(request):
    user = request.user
    serializer = PlantSerializer(data=request.data)

    if serializer.is_valid():
        image_url = serializer.validated_data.get("image_url")
        if image_url:
            relative_path = image_url.replace(settings.MEDIA_URL, "").lstrip("/")
            image_path = os.path.join(settings.MEDIA_ROOT, relative_path)

            if not is_valid_plant_image(image_path):
                return Response({"error": "Изображение не похоже на растение."}, status=400)
        plant = serializer.save(user=user)

        latitude = serializer.validated_data.get("latitude")
        longitude = serializer.validated_data.get("longitude")

        matched_region = None
        for region in Region.objects.all():
            geom = region.geometry
            if geom["type"] == "Polygon":
                for ring in geom["coordinates"]:
                    if point_in_polygon(longitude, latitude, ring):
                        matched_region = region
                        break
            elif geom["type"] == "MultiPolygon":
                for polygon in geom["coordinates"]:
                    for ring in polygon:
                        if point_in_polygon(longitude, latitude, ring):
                            matched_region = region
                            break
            if matched_region:
                break

        if matched_region:
            plant.region = matched_region
            plant.save(update_fields=["region"])
            matched_region.planted_count = (matched_region.planted_count or 0) + 1
            matched_region.save(update_fields=["planted_count"])

            check_achievements(user)
            ActivityLog.objects.create(user=user, action=f"добавил: {plant.species.name}")

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_plant(request, plant_id):
    try:
        plant = Plant.objects.get(id=plant_id, user=request.user)
    except Plant.DoesNotExist:
        return Response({"detail": "Объект не найден или доступ запрещён."}, status=404)

    plant.delete()
    ActivityLog.objects.create(user=request.user, action=f"удалил растение")
    return Response({"detail": "Растение удалено."}, status=204)

@api_view(['GET'])
def get_region_heatmap(request):
    data = []
    raw_scores = {}

    for region in Region.objects.all():
        seasonality = Seasonality.objects.filter(region=region)

        unique_species = set()
        total_months = 0

        for item in seasonality:
            unique_species.add(item.species_id)
            total_months += len(item.months)

        score = len(unique_species) * total_months
        raw_scores[region.id] = {
            "region": region,
            "score": score
        }

    all_scores = [entry["score"] for entry in raw_scores.values()]
    min_score = min(all_scores) if all_scores else 0
    max_score = max(all_scores) if all_scores else 1

    for region_id, entry in raw_scores.items():
        region = entry["region"]
        score = entry["score"]

        if max_score > min_score:
            intensity = round((score - min_score) / (max_score - min_score), 3)
        else:
            intensity = 0

        data.append({
            "id": region.id,
            "name": region.name_ru,
            "geometry": region.geometry,
            "intensity": intensity
        })

    return Response(data)

@api_view(['GET'])
def get_region_info(request, region_id):
    month = int(request.GET.get('month', datetime.now().month))  # текущий месяц

    try:
        region = Region.objects.get(id=region_id)
    except Region.DoesNotExist:
        return Response({"error": "Регион не найден"}, status=404)

    seasonality = Seasonality.objects.filter(region=region, months__contains=[month])
    species_ids = seasonality.values_list("species_id", flat=True).distinct()
    species = Species.objects.filter(id__in=species_ids).values_list("name", flat=True)

    return Response({
        "id": region.id,
        "name": region.name_ru,
        "crops": list(species)
    })

def check_achievements(user):
    user_achievements = UserAchievement.objects.filter(user=user)
    new_achievements = []
    for user_achievement in user_achievements:
        achievement = user_achievement.achievement

        if not user_achievement.completed:
            if achievement.condition == "add_first_tree":
                user_achievement.progress = 1
            elif achievement.condition == "add_10_trees":
                user_achievement.progress += 1
            elif achievement.condition == "add_50_trees":
                user_achievement.progress += 1
            elif achievement.condition == "add_5_species":
                species_count = Plant.objects.filter(user=user).values("species").distinct().count()
                user_achievement.progress = species_count
            elif achievement.condition == "add_10_species":
                species_count = Plant.objects.filter(user=user).values("species").distinct().count()
                user_achievement.progress = species_count
            elif achievement.condition == "add_5_bushes":
                berry_count = Plant.objects.filter(user=user, species__category="bush").count()
                user_achievement.progress = berry_count
            elif achievement.condition == "add_10_locations":
                region_count = Plant.objects.filter(user=user).values("latitude", "longitude").distinct().count()
                user_achievement.progress = region_count

            if user_achievement.progress >= achievement.threshold:
                user_achievement.completed = True
                new_achievements.append(achievement.name)

    UserAchievement.objects.bulk_update(user_achievements, ["progress", "completed"])

    for achievement_name in new_achievements:
        ActivityLog.objects.create(user=user, action=f"получил достижение: {achievement_name}")


class UploadPlantImageView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        image = request.FILES.get("image")
        if not image:
            return Response({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)

        image_path = os.path.join("trees", image.name)
        full_path = os.path.join(settings.MEDIA_ROOT, image_path)

        os.makedirs(os.path.dirname(full_path), exist_ok=True)

        with open(full_path, "wb+") as f:
            for chunk in image.chunks():
                f.write(chunk)

        return Response({"image_url": settings.MEDIA_URL + image_path}, status=status.HTTP_201_CREATED)