from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from rest_framework import routers
from adhd_backend.views import TaskViewSet, MoodLogViewSet, MedicationLogViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView, TokenRefreshView,
)

router = routers.DefaultRouter()
router.register(r'tasks', TaskViewSet)
router.register(r'moodlogs', MoodLogViewSet)
router.register(r'medications', MedicationLogViewSet)

urlpatterns = [
    path('', lambda request: HttpResponse("Welcome to the ADHD API 👋")),
    path("admin/", admin.site.urls),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/", include("adhd_backend.urls")),  # ✅ This includes ALL API endpoints
]