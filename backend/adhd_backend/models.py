from django.db import models

class Task(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    title = models.CharField(max_length=200)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    priority = models.CharField(max_length=10 , choices=PRIORITY_CHOICES , default='medium')
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title


class MedicationLog(models.Model):
    name = models.CharField(max_length=100)
    taken_at = models.DateTimeField(auto_now_add=True)
    dose_mg = models.FloatField()
    brand_name = models.CharField(max_length=100)
    prescribed_on = models.DateField()

    def __str__(self):
        return f"{self.name} ({self.dose_mg}mg)"


class MoodLog(models.Model):
    MOOD_CHOICES = [
        ('happy', 'Happy'),
        ('okay', 'Okay'),
        ('sad', 'Sad'),
        ('anxious', 'Anxious'),
        ('angry', 'Angry'),
        ('jittery', 'Jittery'),
    ]
    mood = models.CharField(max_length=20, choices=MOOD_CHOICES)
    note = models.TextField(blank=True)
    recorded_at = models.DateTimeField(null=True, blank=True)  # <-- editable field

    def __str__(self):
        return f"{self.mood} at {self.recorded_at.strftime('%Y-%m-%d %H:%M') if self.recorded_at else 'No Date'}"



# Create your models here.
