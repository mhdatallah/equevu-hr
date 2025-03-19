from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, BasePermission
from django.http import FileResponse
from django_filters import rest_framework as filters
from django.core.files.storage import default_storage
from django.conf import settings
import os
import logging
from .models import Candidate
from .serializers import CandidateSerializer

logger = logging.getLogger(__name__)


class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return request.headers.get('X-ADMIN') == '1'

    def has_object_permission(self, request, view, obj):
        return request.headers.get('X-ADMIN') == '1'


class CandidateFilter(filters.FilterSet):
    class Meta:
        model = Candidate
        fields = ['department']


class CandidateViewSet(viewsets.ModelViewSet):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer
    filterset_class = CandidateFilter
    permission_classes = [AllowAny]  # Default permission for all actions

    def get_permissions(self):
        """
        Override to require admin access only for list and retrieve actions
        """
        if self.action in ['list', 'retrieve', 'resume']:
            return [IsAdminUser()]
        return [AllowAny()]  # Allow any user for create, update, delete

    def create(self, request, *args, **kwargs):
        try:
            logger.info(f"Creating candidate with data: {request.data}")
            response = super().create(request, *args, **kwargs)
            candidate = Candidate.objects.get(id=response.data['id'])
            logger.info(f"Created candidate with ID: {candidate.id}")
            logger.info(f"Resume path: {candidate.resume.path}")
            logger.info(f"Resume exists: {os.path.exists(candidate.resume.path)}")
            return response
        except Exception as e:
            logger.error(f"Error creating candidate: {str(e)}")
            raise

    @action(detail=True, methods=['get'])
    def resume(self, request, pk=None):
        """
        Get a candidate's resume (admin only)
        """
        try:
            candidate = self.get_object()
            logger.info(f"Downloading resume for candidate {candidate.id}")
            logger.info(f"Resume field: {candidate.resume}")
            logger.info(f"Resume path: {candidate.resume.path}")
            
            if not candidate.resume:
                logger.error("No resume found for candidate")
                return Response(
                    {'error': 'Resume not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Get the file path
            file_path = candidate.resume.path
            logger.info(f"Checking if file exists at: {file_path}")
            
            # Check if file exists
            if not os.path.exists(file_path):
                logger.error(f"File not found at path: {file_path}")
                return Response(
                    {'error': 'Resume file not found on disk'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            logger.info("File found, preparing response")
            # Open and return the file
            response = FileResponse(
                open(file_path, 'rb'),
                as_attachment=True,
                filename=f"{candidate.full_name}_resume{candidate.resume.name[-5:]}"
            )
            return response
            
        except Exception as e:
            logger.error(f"Error downloading resume: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
