from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TaskViewSet,
    MedicationLogViewSet,
    MoodLogViewSet,
    sentiment_summary,
    sentiment_csv_json,
    wordcloud_data,
    register,
)

router = DefaultRouter()
router.register(r'tasks', TaskViewSet)
router.register(r'medicationlogs', MedicationLogViewSet)
router.register(r'moodlogs', MoodLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/' , register),
    path('sentiment-summary/', sentiment_summary),       # bar chart
    path('sentiment-raw/', sentiment_csv_json),          # full CSV as JSON
    path('wordcloud/', wordcloud_data),
]
