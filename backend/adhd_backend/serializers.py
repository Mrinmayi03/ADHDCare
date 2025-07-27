from rest_framework import serializers
from .models import Task, MedicationLog, MoodLog

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ['user']

        def create(self, validated_data):
            return Task.objects.create(user=self.context['request'].user, **validated_data)

class MedicationLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicationLog
        fields = '__all__'
        # tell DRF not to require this on input:
        read_only_fields = ('taken_at',)
        read_only_fields = ['user']

        def create(self, validated_data):
            return Task.objects.create(user=self.context['request'].user, **validated_data)

class MoodLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodLog
        fields = '__all__'
        read_only_fields = ['user']

        def create(self, validated_data):
            return Task.objects.create(user=self.context['request'].user, **validated_data)
