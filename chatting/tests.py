from django.contrib.auth import get_user_model
from django.test import Client
from django.test import TestCase
from .models import Post

# Create your tests here.

User = get_user_model()

class PostTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='Bobby', password='somepassword', email='bobby@gmail.com')
        self.userb = User.objects.create_user(username='Sally', password='somepassword2', email='sallyy@gmail.com')

        Post.objects.create(user=self.user, content='My first post')
        Post.objects.create(user=self.userb, content='My first post from userb')

        self.currentCount = Post.objects.all().count()

    def test_post_created(self):
        post_obj = Post.objects.create(user=self.user, content='My fourth Post')
        self.assertEqual(post_obj.id, 4)
        self.assertEqual(post_obj.user, self.user)

    def get_client(self):
        client = Client()
        client.login(username=self.user.username, password='somepassword', email=self.user.email)
        return client

    # def test_post_list(self):

