from django.db import models
from django.core.validators import FileExtensionValidator
from django.contrib.auth.models import User
from django.db.models.signals import post_save


# Create your models here.

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.CharField(max_length=500)
    image = models.ImageField(upload_to="media_posts", validators=[FileExtensionValidator(['png', 'jpg', 'jpeg'])], blank=True)
    liked = models.ManyToManyField(User, blank=True, related_name="likes")
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def total_likes(self):
        return self.liked.count()

    def __str__(self):
        return str(self.content[:10])

    @property
    def imageURL(self):
        try:
            url = self.image.url
        except:
            url = ''
        return url

    class Meta:
        ordering = ['-updated']

class UserFollowing(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following")
    following_user_id = models.ManyToManyField(User, related_name="followers")
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username

    def total_followers(self):
        return self.following_user_id.all().count()

def create_follow_query(sender, instance, created, *args, **kwargs):
    if created:
        UserFollowing.objects.get_or_create(user=instance)

post_save.connect(create_follow_query, sender=User)

# Tried to add a OneToOneField here but got IntegrityError - UNIQUE constraint failed:. The only way to use OneToOneField is to add it to a Profile model and that is it, I kept using User model everywhere so it wouldn't work, so changed to a foreignkey
class UserAvatar(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    avatar = models.ImageField(default='avatar.png', upload_to='avatars')

    def __str__(self):
        return self.user.username

def create_avatar_query(sender, instance, created, *args, **kwargs):
    if created:
        UserAvatar.objects.get_or_create(user=instance)
post_save.connect(create_avatar_query, sender=User)