from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, MedicationLogViewSet, MoodLogViewSet

router = DefaultRouter()
router.register(r'tasks', TaskViewSet)
router.register(r'medication-logs', MedicationLogViewSet)
router.register(r'mood-logs', MoodLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
