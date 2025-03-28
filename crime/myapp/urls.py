from django.urls import path
from django.shortcuts import redirect
from . import views
from .views import CustomLoginView
from django.contrib.auth import views as auth_views

app_name = 'myapp'

# urlpatterns = [
#     # Redirect root URL to login page
#     path('', lambda request: redirect('myapp:login'), name='root_redirect'),

#     # Authentication URLs
#     path('login/', CustomLoginView.as_view(), name='login'),
#     path('logout/', auth_views.LogoutView.as_view(next_page='myapp:login'), name='logout'),

#     # Protected Routes
#     path('predict/', views.predict, name='predict'),  # Updated this to predict instead of home
# ]
urlpatterns = [
    path('', views.home, name='home'),
    path('predict/', views.predict, name='predict'),
    
    # Authentication URLs
     path('login/', CustomLoginView.as_view(), name='login'),
    
    path('logout/', auth_views.LogoutView.as_view(
        next_page='myapp:login'  # Redirect to login page after logout
    ), name='logout'),
]