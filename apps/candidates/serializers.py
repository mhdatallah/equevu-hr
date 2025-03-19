from rest_framework import serializers
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import UploadedFile
from .models import Candidate


class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = [
            'id',
            'full_name',
            'date_of_birth',
            'years_of_experience',
            'department',
            'resume',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']

    def validate_resume(self, value):
        if not isinstance(value, UploadedFile):
            return value

        # Check file size (5MB limit)
        max_size = 5 * 1024 * 1024  # 5MB in bytes
        if value.size > max_size:
            raise ValidationError('File size cannot exceed 5MB.')

        # File type validation is handled by the model's FileExtensionValidator
        return value 