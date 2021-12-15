from django.db import models
from django.core.validators import FileExtensionValidator

# Create your models here.

class Post(models.Model):
    content = models.CharField(max_length=500)
    image = models.ImageField(upload_to="media_posts", validators=[FileExtensionValidator(['png', 'jpg', 'jpeg'])], blank=True)
    # liked = models.ManyToManyField(Profile, blank=True, related_name="likes")
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    # author = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="posts")

    def __str__(self):
        return str(self.content[:10])

    @property
    def imageURL(self):
        try:
            url = self.image.url
        except:
            url = ''
        return url