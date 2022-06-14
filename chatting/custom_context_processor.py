from .models import UserFollowing, UserAvatar
from django.contrib.auth.models import User
import random

def users_available(request):

    # user = User.objects.get(id=id)
    # print(f"Profile user {user}")
    r_user = User.objects.get(id=request.user.id)
    print(f"Main user {r_user}")

    users = User.objects.all().exclude(id=r_user.id)
    followed_profiles = UserFollowing.objects.get(user=r_user)
    all_followed_profiles = followed_profiles.following_user_id.all()
    available = [user for user in users if user not in all_followed_profiles]
    print(f"Available {available}")

    random.shuffle(available)

    return {
        'all_followed_profiles': all_followed_profiles, 'available': available
    }