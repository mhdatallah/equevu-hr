import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.exceptions import ValidationError
from ..models import Candidate, Department


@pytest.mark.django_db
class TestCandidateModel:
    def test_create_candidate(self):
        """Test creating a candidate with valid data"""
        resume = SimpleUploadedFile(
            "resume.pdf",
            b"file_content",
            content_type="application/pdf"
        )
        
        candidate = Candidate.objects.create(
            full_name="John Doe",
            date_of_birth="1990-01-01",
            years_of_experience=5,
            department=Department.IT,
            resume=resume
        )
        
        assert candidate.full_name == "John Doe"
        assert str(candidate) == "John Doe"
        assert candidate.department == Department.IT
        
    def test_invalid_department(self):
        """Test that invalid department raises validation error"""
        with pytest.raises(ValidationError):
            candidate = Candidate(
                full_name="John Doe",
                date_of_birth="1990-01-01",
                years_of_experience=5,
                department="INVALID",
            )
            candidate.full_clean()
            
    def test_negative_experience(self):
        """Test that negative years of experience raises validation error"""
        with pytest.raises(ValidationError):
            candidate = Candidate(
                full_name="John Doe",
                date_of_birth="1990-01-01",
                years_of_experience=-1,
                department=Department.IT,
            )
            candidate.full_clean() 