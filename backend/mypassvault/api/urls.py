from django.urls import path, include
from .views import SignUp, Login, generate_random_password, UserProfileView, PasswordEntryListCreateAPIView, PasswordEntryRetrieveUpdateDeleteAPIView 

urlpatterns = [
    path('signup/', SignUp.as_view()),
    path('login/', Login.as_view()),
    path('generate-password/', generate_random_password),
    path('profile/', UserProfileView.as_view()),
    path('passwords/', PasswordEntryListCreateAPIView.as_view()),
    path('passwords/<int:pk>/', PasswordEntryRetrieveUpdateDeleteAPIView.as_view()),
]