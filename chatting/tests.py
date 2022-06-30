from django.contrib.auth import get_user_model
from django.test import Client
from django.test import TestCase
from .models import Post
from .models import UserFollowing

# Create your tests here.

User = get_user_model()

class PostTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(id=1, username='Bobby', password='somepassword', email='bobby@gmail.com')
        self.userb = User.objects.create_user(id=2, username='Sally', password='somepassword2', email='sally@gmail.com')
        self.userc = User.objects.create_user(id=3, username='Cooler', password='somepassword3', email='cooler@gmail.com')

        Post.objects.create(id=1, user=self.user, content='My first post')
        Post.objects.create(id=2, user=self.userb, content='My first post from userb')
        Post.objects.create(id=3, user=self.userb, content='My first post from userc')

        self.currentCount = Post.objects.all().count()
        print(f"Number of posts, {self.currentCount}")

    def test_post_created(self):
        post_obj = Post.objects.create(id=4, user=self.user, content='My third Post')
        self.assertEqual(post_obj.id, 4)
        self.assertEqual(post_obj.user, self.user)

    def get_client(self):
        client = Client()
        client.login(username=self.user.username, password='somepassword', email=self.user.email)
        return client

    def test_followed_profile(self):
        followed_profiles = UserFollowing.objects.get(user=self.user)
        print(f"Followed Profiles, {followed_profiles}")

