from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import BaseUserManager
from django.conf import settings
import requests

# Create your models here.

class CustomUserManager(BaseUserManager):
    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("Email must be provided.")
        if not password:
            raise ValueError("Password must be provided.")
        if not extra_fields.get('first_name'):
            raise ValueError("First name must be provided.")
        if not extra_fields.get('last_name'):
            raise ValueError("Last name must be provided.")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)


    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_superuser', True)
        if not extra_fields.get('first_name'):
            raise ValueError('Superuser must have a first name.')
        if not extra_fields.get('last_name'):
            raise ValueError('Superuser must have a last name.')
        return self._create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)

    objects =  CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email
    
class PasswordEntry(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='password_entries')
    site_name = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    logo_url = models.URLField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    domain_extension = models.CharField(max_length=10, default='.com')

    def save(self, *args, **kwargs):
        if not self.logo_url and self.site_name:
            extension = getattr(self, 'domain_extension', '.com')
            site_cleaned = self.site_name.lower().replace(' ', '')
            
            if site_cleaned.endswith(extension):
                company = site_cleaned
            else:
                company = f"{site_cleaned}{extension}"

            token = "pk_fOShpbENQ2uR25M_0i-J1Q"

            logo_url = f"https://img.logo.dev/{company}?token={token}"

            try:
                response = requests.get(logo_url)
                print("Checking logo for:", company)
                print("GET status code:", response.status_code)        
                
                if response.status_code == 200:
                    self.logo_url = logo_url
                else:
                    self.logo_url = ""

            except requests.exceptions.RequestException as e:
                print("Error checking logo URL:", e)
                self.logo_url = ""
                
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.site_name} - {self.email}"