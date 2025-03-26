from django.urls import path
from . import views
from django.contrib.auth import views as auth_views
from .views import CustomLoginView

app_name = 'myapp'

urlpatterns = [
    path('', views.home, name='home'),
    path('predict/', views.predict, name='predict'),
    
    # Authentication URLs
     path('login/', CustomLoginView.as_view(), name='login'),
    
    path('logout/', auth_views.LogoutView.as_view(
        next_page='myapp:login'  # Redirect to login page after logout
    ), name='logout'),
]