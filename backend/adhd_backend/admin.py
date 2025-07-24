from django.contrib import admin
from .models import Task, MedicationLog, MoodLog

admin.site.register(Task)
admin.site.register(MedicationLog)
admin.site.register(MoodLog)