from django.contrib import admin
from .models import Post, UserFollowing, UserAvatar

# Register your models here.
admin.site.register(Post)
admin.site.register(UserFollowing)
admin.site.register(UserAvatar)