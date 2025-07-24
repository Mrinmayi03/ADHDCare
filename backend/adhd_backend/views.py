from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Task, MedicationLog, MoodLog
from .serializers import TaskSerializer, MedicationLogSerializer, MoodLogSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('-created_at')
    serializer_class = TaskSerializer

class MedicationLogViewSet(viewsets.ModelViewSet):
    queryset = MedicationLog.objects.all().order_by('-taken_at')
    serializer_class = MedicationLogSerializer

class MoodLogViewSet(viewsets.ModelViewSet):
    queryset = MoodLog.objects.all()
    # .order_by('-recorded_at')
    serializer_class = MoodLogSerializer

