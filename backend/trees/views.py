from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Tree
from .serializers import TreeSerializer


class TreeList(APIView):
    def get(self, request):
        trees = Tree.objects.all()
        serializer = TreeSerializer(trees, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TreeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
