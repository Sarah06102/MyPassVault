from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import CustomUser
from .serializers import SignUpSerializer
from rest_framework_simplejwt.tokens import RefreshToken
import random 
import string
from django.http import JsonResponse

# Create your views here.

#Signup API
class SignUp(APIView):
    def post(self, request):
        data = request.data
        serializer = SignUpSerializer(data = data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully!", "success": True}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

#Login API
class Login(APIView):
    def post(self, request):
        data = request.data
        user = CustomUser.objects.filter(email=data['email']).first()
        if user is None:
            return Response({"message": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)
        if not user.check_password(data['password']):
            return Response({"message": "Password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)
        
        token = RefreshToken.for_user(user)
        return Response({"message": "Login Successful", "Success": True, "token": str(token)})
        

#Password Generator 
def generate_random_password(request):
    length = int(request.GET.get('length', 10))
    password = []
    chars = string.ascii_letters + string.digits + string.punctuation
    for char in range(length):
        password_chars = (random.choice(chars))
        password.append(password_chars)
    generated_password = ''.join(password)
    return JsonResponse({'password': generated_password})