from django.urls import path
from . import views
from .views import UploadPlantImageView

urlpatterns = [
    path('add/', views.add_plant, name='add-plant'),
    path('get-plants/', views.get_plants, name='get-plants'),
    path('get_species/', views.get_species, name='get_species'),
    path('upload-image/', UploadPlantImageView.as_view(), name='upload-plant-image'),
    path('get-regions/', views.get_regions, name='get-regions'),
    path("heatmap/", views.get_region_heatmap),
    path('region-info/<int:region_id>/', views.get_region_info, name='region-info'),
    path('delete/<int:plant_id>/', views.delete_plant, name='delete-plant'),
]
