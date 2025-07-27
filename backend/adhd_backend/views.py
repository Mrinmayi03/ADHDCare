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

# Add to the top
from rest_framework.decorators import api_view
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated
from rest_framework import permissions, viewsets


import csv
from collections import Counter
import re
from django.conf import settings
import os

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user
    

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

    permission_classes = [IsAuthenticated, IsOwner]
    serializer_class = TaskSerializer

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):                  # ◀️ auto‑assign user on create
        serializer.save(user=self.request.user)

class MedicationLogViewSet(viewsets.ModelViewSet):
    queryset = MedicationLog.objects.all().order_by('-taken_at')
    serializer_class = MedicationLogSerializer

    permission_classes = [IsAuthenticated, IsOwner]
    serializer_class = MedicationLogSerializer

    def get_queryset(self):
        return MedicationLog.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):                  # ◀️ auto‑assign user on create
        serializer.save(user=self.request.user)

class MoodLogViewSet(viewsets.ModelViewSet):
    queryset = MoodLog.objects.all().order_by('-recorded_at')
    serializer_class = MoodLogSerializer

    permission_classes = [IsAuthenticated, IsOwner]
    serializer_class = MoodLogSerializer

    def get_queryset(self):
        return MoodLog.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):                  # ◀️ auto‑assign user on create
        serializer.save(user=self.request.user)


# -------------- Sentiment summary you already have --------------
@api_view(['GET'])
def sentiment_summary(request):
    file_path = os.path.join(settings.BASE_DIR,
                             'medication_analysis',
                             'sentiment_analysis_results.csv')
    summary = {}
    try:
        with open(file_path, encoding='utf-8', newline='') as f:
            reader = csv.DictReader(f)
            for row in reader:
                med = row['medication']
                sent = row['sentiment'].upper()
                if med not in summary:
                    summary[med] = {'positive': 0, 'negative': 0}
                if sent in ('POSITIVE', 'NEGATIVE'):
                    summary[med][sent.lower()] += 1
    except FileNotFoundError:
        return Response({'error': 'CSV file not found'}, status=404)

    return Response([
        {'medication': med, 'positive': data['positive'], 'negative': data['negative']}
        for med, data in summary.items()
    ])


# -------------- NEW: Word‑cloud data endpoint --------------
# A small set of english stopwords; feel free to expand
STOPWORDS = {
    "the","and","to","a","i","of","in","it","that","was","on","for","is",
    "my","with","but","this","have","not","had","at","me","as","be","so",
    "if","just","from","like","they","or","are","an","you","very","out"
}

@api_view(['GET'])
def wordcloud_data(request):
    med_name = request.query_params.get('med')
    if not med_name:
        return Response({'error': 'med query‑param required'}, status=400)

    file_path = os.path.join(settings.BASE_DIR,
                             'medication_analysis',
                             'sentiment_analysis_results.csv')
    if not os.path.exists(file_path):
        return Response({'error': 'CSV file not found'}, status=404)

    counter = Counter()
    with open(file_path, encoding='utf-8', newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row['medication'].lower() == med_name.lower():
                # break each comment into words, lowercase, drop stopwords
                words = re.findall(r'\b\w+\b', row['comment'].lower())
                for w in words:
                    if w not in STOPWORDS:
                        counter[w] += 1

    # take top 100 and format for your React D3Cloud (text+value)
    top100 = counter.most_common(100)
    return Response([{'text': w, 'value': v} for w, v in top100])