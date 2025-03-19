from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CandidateViewSet

router = DefaultRouter()
router.register('', CandidateViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 