from django.urls import path
from .views import TreeList

urlpatterns = [
    path('api/trees/', TreeList.as_view(), name='tree-list'),
]
