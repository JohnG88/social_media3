from .models import UserFollowing, UserAvatar
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
import random

# https://stackoverflow.com/questions/43173618/django-context-processor-login-in-issue

# @login_required(login_url='login')
def users_available(request):
    if request.user.is_authenticated:
        # user = User.objects.get(id=id)
        # print(f"Profile user {user}")
        r_user = User.objects.get(id=request.user.id)

        users = User.objects.all().exclude(id=r_user.id)
        followed_profiles = UserFollowing.objects.get(user=r_user)
        all_followed_profiles = followed_profiles.following_user_id.all()
        available = [user for user in users if user not in all_followed_profiles]

        random.shuffle(available)

        return {
            'all_followed_profiles': all_followed_profiles, 'available': available[:3]
        }
    return {}