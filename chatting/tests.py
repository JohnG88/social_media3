import json
from re import T
from chatting.views import index, comment_post
from django.contrib.auth import get_user_model
from django.test import Client
from django.test import TestCase
from django.db.models import Q
from django.test import SimpleTestCase
from django.urls import reverse, resolve
from .forms import PostModelForm
from .models import Comments, Post, UserAvatar, UserFollowing

# Create your tests here.

User = get_user_model()

# Use SimpleTasteCase for tests that don't require querying from models
class TestUrls(SimpleTestCase):
    def test_list_url_resolves(self):
        url = reverse('index')
        # print(resolve(url))
        self.assertEquals(resolve(url).func, index)

    def test_comment_url_resolves(self):
        url = reverse('comments', args=[1])
        # print(resolve(url))
        self.assertEquals(resolve(url).func, comment_post)

class TestViews(TestCase):
    def setUp(self):
        self.user = User.objects.create_user('Billy', 'billy@gmail.com', 'somepassword')
        self.post = Post.objects.create(
            user=self.user,
            content='My first post'
        )

    def get_client(self):
        client = Client()
        client.login(username=self.user.username, password='somepassword')
        return client

    def test_index_post_list_GET(self):
        client = self.get_client()
        response = client.get(reverse('index'))
        self.assertEquals(response.status_code, 200)
        self.assertTemplateUsed(response, 'chatting/index.html')

    def test_profile_page_post_list_GET(self):
        client = self.get_client()
        response = client.get(reverse('profile', args=[1]))
        self.assertEquals(response.status_code, 200)
        self.assertTemplateUsed(response, 'chatting/profile.html')

    def test_single_post_detail_GET(self):
        client = self.get_client()
        response = client.get(reverse('single-post', args=[1]))
        self.assertEquals(response.status_code, 200)
        self.assertTemplateUsed(response, 'chatting/single_post.html')

    def test_post_add_POST(self):
        client = self.get_client()
        response = client.post('/', {
            'user': self.user.id,
            'content': 'Hello'
        })
        self.assertEquals(response.status_code, 200)
        response_data = response.json()
        new_post_content = response_data.get('content')
        new_post_id = response_data.get('id')
        # print(f'new_post_id {new_post_id}')
        self.assertEquals(new_post_id, 2)

    def test_post_DELETE(self):
        Post.objects.create(user=self.user, content='Second Post')
        # Post.objects.create(user=self.user, content='third Post')
        delete_url = reverse('delete-post', args=[2])
        client = self.get_client()
        response = client.delete(delete_url)
        # self.post.delete()
        # all_posts = Post.objects.all()
        self.assertEquals(response.status_code, 200)
        # self.assertEquals()
        
class TestModels(TestCase):

    def setUp(self):
        self.user = User.objects.create_user('Billy', 'billy@gmail.com', 'somepassword')
        self.post1 = Post.objects.create(
            user=self.user,
            content='Hello Billy'
        )

    def test_post_comments(self):
        comment = Comments.objects.create(
            user=self.user,
            post=self.post1,
            body='First comment'
        )
        # post =self.post1
        post_comment = Comments.objects.get(id=1)
        self.assertEquals(post_comment.post.content, 'Hello Billy')
        # self.assertEquals(self.post1.post_comment.body, 'First comment')
        # self.assertEquals(comment.id, 1)

    # def test_comment_is_assigned_to_post(self):
    #     self.assertEquals(self.post1_comment_set.all().body, 'First comment')

    def test_user_avatar(self):
        # user_avatar = UserAvatar.objects.create(
        #     user=self.user
        # )
        all_user_avatars = UserAvatar.objects.all()
        print(f'All user avatars {all_user_avatars}')
        # self.assertEquals(all_user_avatars.len(), 1)

class TestForms(TestCase):
    def setUp(self):
        self.user = User.objects.create_user('Billy', 'billy@gmail.com', 'somepassword')

    def test_post_form(self):
        form = PostModelForm(data={
            'user': self.user,
            'content': "What post?"
        })
        self.assertTrue(form.is_valid())

    def test_post_form_no_data(self):
        form = PostModelForm(data={})
        self.assertFalse(form.is_valid())
        self.assertEquals(len(form.errors), 1)

class PostTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(id=1, username='Bobby', password='somepassword', email='bobby@gmail.com')
        self.userb = User.objects.create_user(id=2, username='Sally', password='somepassword2', email='sally@gmail.com')
        self.userc = User.objects.create_user(id=3, username='Cooler', password='somepassword3', email='cooler@gmail.com')

        self.follower_user = UserFollowing.objects.get(user=self.user)

        Post.objects.create(id=1, user=self.user, content='My first post')
        Post.objects.create(id=2, user=self.userb, content='My first post from userb')
        Post.objects.create(id=3, user=self.userc, content='My first post from userc')

        self.currentCount = Post.objects.all().count()
        # print(f"Number of posts, {self.currentCount}")

    def test_post_created(self):
        post_obj = Post.objects.create(id=4, user=self.user, content='My third Post')
        self.assertEqual(post_obj.id, 4)
        self.assertEqual(post_obj.user, self.user)

    def get_client(self):
        client = Client()
        client.login(username=self.user.username, password='somepassword', email=self.user.email)
        return client

    def test_followed_profile(self):
        self.follower_user.following_user_id.add(self.userb)
        print(f"Followed Profiles, {self.follower_user.following_user_id.all()}")

    def test_user_users_followed_posts(self):
        self.follower_user.following_user_id.add(self.userb)
        user_followed_users_posts = Post.objects.filter(Q(user__in=self.follower_user.following_user_id.all()) | Q(user=self.user))
        print(f'user and users followed posts {user_followed_users_posts}')

