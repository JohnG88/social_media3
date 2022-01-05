from django.db import models
from django.core.validators import FileExtensionValidator
from django.contrib.auth.models import User

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

    def total_followers(self):
        return self.following_user_id.count()

    @property
    def get_following_list(self):
        pass
    
    @property
    def total_following_count(self):
        return len(self.get_following_list())