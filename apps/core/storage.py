from django.conf import settings
from django.core.files.storage import FileSystemStorage
from storages.backends.s3boto3 import S3Boto3Storage


class CustomStorage:
    """
    Factory class to get the appropriate storage backend
    """
    @staticmethod
    def get_storage():
        if settings.DEFAULT_FILE_STORAGE == 'storages.backends.s3boto3.S3Boto3Storage':
            return S3Boto3Storage()
        return FileSystemStorage() 