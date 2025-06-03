from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import CustomUser, PasswordEntry
from .serializers import SignUpSerializer, PasswordEntrySerializer
from rest_framework_simplejwt.tokens import RefreshToken
import random 
import string
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import ensure_csrf_cookie


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
            return Response({"message": "Invalid password."}, status=status.HTTP_400_BAD_REQUEST)
        
        token = RefreshToken.for_user(user)
        return Response({"message": "Login Successful", "Success": True, "token": str(token), "access": str(token.access_token),})
        
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
        })

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

class PasswordEntryListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        entries = PasswordEntry.objects.filter(user=request.user)
        serializer = PasswordEntrySerializer(entries, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = PasswordEntrySerializer(data=request.data)
        if serializer.is_valid():
            password_entry = serializer.save(user=request.user)
            updated_serializer = PasswordEntrySerializer(password_entry)
            return Response(updated_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordEntryRetrieveUpdateDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    
    def get_object(self, pk, user):
        try:
            return PasswordEntry.objects.get(pk=pk, user=user)
        except PasswordEntry.DoesNotExist:
            return None
    
    def get(self, request, pk):
        entry = self.get_object(pk, request.user)
        if not entry:
            return Response({"error": "Not found",}, status=status.HTTP_404_NOT_FOUND)
        serializer = PasswordEntrySerializer(entry)
        return Response(serializer.data)
    
    def put(self, request, pk):
        entry = self.get_object(pk, request.user)
        if not entry:
            return Response({"error": "Not found",}, status=status.HTTP_404_NOT_FOUND)
        serializer = PasswordEntrySerializer(entry, data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        entry = self.get_object(pk, request.user)
        if not entry:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        entry.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'message': 'CSRF token set'})