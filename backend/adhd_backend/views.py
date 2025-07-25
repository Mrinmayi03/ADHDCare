from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets
from django.http import JsonResponse
from django.conf import settings

import csv
import os
from collections import defaultdict

from .models import Task, MedicationLog, MoodLog
from .serializers import TaskSerializer, MedicationLogSerializer, MoodLogSerializer

# API: Sentiment Summary for Bar Chart
@api_view(['GET'])
def sentiment_summary(request):
    file_path = os.path.join(settings.BASE_DIR, 'medication_analysis', 'sentiment_analysis_results.csv')
    summary = defaultdict(lambda: {'positive': 0, 'negative': 0})

    try:
        with open(file_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                med = row['medication']
                sentiment = row['sentiment'].upper()
                if sentiment in ['POSITIVE', 'NEGATIVE']:
                    summary[med][sentiment.lower()] += 1
    except FileNotFoundError:
        return Response({'error': 'CSV file not found'}, status=404)

    results = [
        {'medication': med, 'positive': data['positive'], 'negative': data['negative']}
        for med, data in summary.items()
    ]
    return Response(results)

# API: Serve full CSV data as JSON
@api_view(['GET'])
def sentiment_csv_json(request):
    file_path = os.path.join(settings.BASE_DIR, 'medication_analysis', 'sentiment_analysis_results.csv')

    try:
        with open(file_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            data = [row for row in reader]
        return JsonResponse(data, safe=False)
    except FileNotFoundError:
        return JsonResponse({'error': 'CSV file not found'}, status=404)

# ViewSets for core models
class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('-created_at')
    serializer_class = TaskSerializer

class MedicationLogViewSet(viewsets.ModelViewSet):
    queryset = MedicationLog.objects.all().order_by('-taken_at')
    serializer_class = MedicationLogSerializer

class MoodLogViewSet(viewsets.ModelViewSet):
    queryset = MoodLog.objects.all().order_by('-recorded_at')
    serializer_class = MoodLogSerializer
