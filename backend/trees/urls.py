from django.urls import path
from . import views

urlpatterns = [
    path('add/', views.add_plant, name='add-plant'),
]
