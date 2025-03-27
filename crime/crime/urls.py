from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect

def redirect_to_login(request):
    return redirect('myapp:login')  # Redirects the root URL to the login page

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('myapp.urls')),  # Includes app-level URLs
]
