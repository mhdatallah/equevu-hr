import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from rest_framework import status
from ..models import Candidate, Department


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def admin_client(api_client):
    api_client.defaults['HTTP_X_ADMIN'] = '1'
    return api_client


@pytest.fixture
def sample_resume():
    return SimpleUploadedFile(
        "resume.pdf",
        b"file_content",
        content_type="application/pdf"
    )


@pytest.mark.django_db
class TestCandidateAPI:
    def test_create_candidate(self, api_client, sample_resume):
        """Test creating a candidate through the API"""
        data = {
            'full_name': 'John Doe',
            'date_of_birth': '1990-01-01',
            'years_of_experience': 5,
            'department': Department.IT,
            'resume': sample_resume
        }
        
        response = api_client.post('/api/candidates/', data, format='multipart')
        assert response.status_code == status.HTTP_201_CREATED
        assert Candidate.objects.count() == 1
        assert Candidate.objects.get().full_name == 'John Doe'
        
    def test_list_candidates_admin(self, admin_client):
        """Test listing candidates as admin"""
        response = admin_client.get('/api/candidates/')
        assert response.status_code == status.HTTP_200_OK
        
    def test_list_candidates_non_admin(self, api_client):
        """Test listing candidates as non-admin"""
        response = api_client.get('/api/candidates/')
        assert response.status_code == status.HTTP_403_FORBIDDEN
        
    def test_filter_by_department(self, admin_client):
        """Test filtering candidates by department"""
        Candidate.objects.create(
            full_name='John IT',
            date_of_birth='1990-01-01',
            years_of_experience=5,
            department=Department.IT,
            resume=SimpleUploadedFile("it.pdf", b"content", content_type="application/pdf")
        )
        Candidate.objects.create(
            full_name='John HR',
            date_of_birth='1990-01-01',
            years_of_experience=5,
            department=Department.HR,
            resume=SimpleUploadedFile("hr.pdf", b"content", content_type="application/pdf")
        )
        
        response = admin_client.get('/api/candidates/', {'department': Department.IT})
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
        assert response.data['results'][0]['department'] == Department.IT 