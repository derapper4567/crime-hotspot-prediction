# myapp/backends.py
from django.contrib.auth import get_user_model

class UsernameOnlyAuthBackend:
    def authenticate(self, request, username=None):
        User = get_user_model()
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            return None

    def get_user(self, user_id):
        User = get_user_model()
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None