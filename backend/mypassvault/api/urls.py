from django.urls import path, include
from .views import SignUp, Login, generate_random_password, UserProfileView, PasswordEntryListCreateAPIView, PasswordEntryRetrieveUpdateDeleteAPIView, get_csrf_token, db_check, CustomPasswordResetConfirmView, MobilePasswordResetView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth import views as auth_views


urlpatterns = [
    path('signup/', SignUp.as_view(), name='signup'),
    path('login/', Login.as_view(), name='login'),
    path('generate-password/', generate_random_password),
    path('profile/', UserProfileView.as_view()),
    path('passwords/', PasswordEntryListCreateAPIView.as_view()),
    path('passwords/<int:pk>/', PasswordEntryRetrieveUpdateDeleteAPIView.as_view()),
    path('token/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('password_reset/', auth_views.PasswordResetView.as_view(email_template_name='registration/password_reset_email.html', html_email_template_name='registration/password_reset_email.html', subject_template_name='registration/password_reset_subject.txt', ), name='password_reset'),
    path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', CustomPasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    path('csrf/', get_csrf_token),
    path('api/db/', db_check),
    path('mobile/password_reset/', MobilePasswordResetView.as_view(), name='mobile_password_reset'),
]