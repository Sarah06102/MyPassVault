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
    #Get from frontend
    length = int(request.GET.get('length', 10))
    include_uppercase = request.GET.get('uppercase') == 'true'
    include_lowercase = request.GET.get('lowercase') == 'true'
    include_numbers = request.GET.get('numbers') == 'true'
    include_symbols = request.GET.get('symbols') == 'true'

    chars = ''
    if include_uppercase:
        chars += string.ascii_uppercase
    if include_lowercase:
        chars += string.ascii_lowercase
    if include_numbers:
        chars += string.digits
    if include_symbols:
        chars += string.punctuation
    if not chars:
        chars = string.ascii_letters + string.digits + string.punctuation

    password = []
    for char in range(length):
        password_chars = (random.choice(chars))
        password.append(password_chars)
    generated_password = ''.join(password)
    return JsonResponse({'password': generated_password})