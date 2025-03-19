from django.db import models
from django.core.validators import MinValueValidator, FileExtensionValidator
from django.utils.translation import gettext_lazy as _


class Department(models.TextChoices):
    IT = 'IT', _('IT')
    HR = 'HR', _('HR')
    FINANCE = 'FINANCE', _('Finance')


class Candidate(models.Model):
    full_name = models.CharField(max_length=255)
    date_of_birth = models.DateField()
    years_of_experience = models.PositiveIntegerField(
        validators=[MinValueValidator(0)]
    )
    department = models.CharField(
        max_length=10,
        choices=Department.choices,
    )
    resume = models.FileField(
        upload_to='resumes/%Y/%m/%d/',
        validators=[
            FileExtensionValidator(allowed_extensions=['pdf', 'docx'])
        ]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['department']),
        ]

    def __str__(self):
        return self.full_name
