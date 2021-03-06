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
        return f'{self.content[:10]} | {self.user.username}'

    def delete(self, *args, **kwargs):
        self.image.delete()
        super().delete(*args, **kwargs)

    @property
    def imageURL(self):
        try:
            url = self.image.url
        except:
            url = ''
        return url

    class Meta:
        ordering = ['-updated']

class Comments(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    body = models.CharField(max_length=500, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}, {self.post.id}, {self.id}, {self.body}"

    class Meta:
        ordering = ['-created']

class UserFollowing(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following")
    following_user_id = models.ManyToManyField(User, blank=True, related_name="followers")
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username

    def total_following(self):
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

    def delete(self, *args, **kwargs):
        self.avatar.delete()
        super().delete(*args, **kwargs)

    @property
    def imageURL(self):
        try:
            url = self.avatar.url
        except:
            url = ''
        return url

def create_avatar_query(sender, instance, created, *args, **kwargs):
    if created:
        UserAvatar.objects.get_or_create(user=instance)
post_save.connect(create_avatar_query, sender=User)