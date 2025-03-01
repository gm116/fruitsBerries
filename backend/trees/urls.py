from django.urls import path
from . import views

urlpatterns = [
    path('add/', views.add_plant, name='add-plant'),
    path('get-plants/', views.get_plants, name='get-plants'),
]
