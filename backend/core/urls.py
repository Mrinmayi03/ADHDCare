from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from rest_framework import routers
from adhd_backend.views import TaskViewSet, MoodLogViewSet, MedicationLogViewSet

router = routers.DefaultRouter()
router.register(r'tasks', TaskViewSet)
router.register(r'moodlogs', MoodLogViewSet)
router.register(r'medications', MedicationLogViewSet)

urlpatterns = [
    path('', lambda request: HttpResponse("Welcome to the ADHD API 👋")),
    path("admin/", admin.site.urls),
    path("api/", include("adhd_backend.urls")),  # ✅ This includes ALL API endpoints
]