from django.urls import path, include
from .views import SignUp, Login, generate_random_password

urlpatterns = [
    path('signup/', SignUp.as_view()),
    path('login/', Login.as_view()),
    path('generate-password/', generate_random_password),
]