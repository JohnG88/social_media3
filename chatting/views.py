from django.http.response import HttpResponseRedirect, JsonResponse
from django.shortcuts import redirect, render,get_object_or_404
from django.conf import settings
from django.contrib import messages
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import AuthenticationForm
import json
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.paginator import EmptyPage, Paginator
from django.db.models import Q
from django.template.loader import render_to_string
from django.urls import reverse
from .models import Post, UserFollowing, UserAvatar, Comments
from .forms import PostModelForm, UserAvatarModelForm, CustomUserCreationForm, CommentsModelForm, ProfilePostModelForm

import random

# Create your views here.

def error_404_view(request, exception):
    # we add the path to the 404.html file here. The name of our HTML file is 404.html
    return render(request, 'chatting/404.html')

@login_required(login_url='login')
def index(request):
    if request.user.is_authenticated:
        main_user = request.user
        user = User.objects.get(id=main_user.id)
        form = PostModelForm()

        if request.method == 'POST':
            data_answer = request.POST.get("content");
            data_image_answer = request.FILES.get("image")
            
            new_post = Post.objects.create(user=user)
            new_post.content = data_answer
            new_post.image = data_image_answer
            new_post.save()
            
            for user_profile_image in new_post.user.useravatar_set.all():
                user_profile_image.imageURL
            
            return JsonResponse({
                'user_id': user.id,
                'id': new_post.id,
                'user': new_post.user.username,
                'post_user_id': new_post.user.id,
                'user_profile_image': user_profile_image.imageURL,
                'content': new_post.content,
                'image': new_post.imageURL,
                'likes': True if user in new_post.liked.all() else False,
                'likes_count': new_post.total_likes(),
                'created': new_post.created.strftime("%b. %d, %Y, %I:%M:%S %p"),
                'comments': ''
            })

        # created the request.user query for UserFollowing
        followed_profiles = UserFollowing.objects.get(user=request.user)
        
        # queried the user from posts and linked it to followers from UserFollowing's following_user_id's related name and instanced followed_profiles to it 
        # using .distinct() helps eliminate duplicate values
        follower_user_posts = Post.objects.filter(Q(user__in=followed_profiles.following_user_id.all()) | Q(user=main_user))
        
        page_number = int(request.GET.get('page', 1))
        
        paginator = Paginator(follower_user_posts, 10)

        try:
            post_page = paginator.page(page_number)
        except EmptyPage:
            return JsonResponse({
                "end_pagination": True
            })
        
    is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
    
    if not is_ajax:
        context = {'follower_user_posts': follower_user_posts, 'form': form, 'user': user,  'post_page': post_page}
        return render(request, "chatting/index.html", context)

    else:    
        data = []

        for post in post_page:
            for img_useravatar in post.user.useravatar_set.all():
                img_useravatar.imageURL

            data_comments = []

            for comments in post.comments_set.all():
                print(f"Comments {comments.id}");

                for comment_user_profile in comments.user.useravatar_set.all():
                    comment_user_profile.imageURL

                comments_post = {
                    'comment_user_profile': comment_user_profile.imageURL,
                    'comment_user': comments.user.username,
                    'body': comments.body
                }
                data_comments.append(comments_post)
                

            posts = {
                'id': post.id,
                'user': post.user.username,
                'user_id': post.user.id,
                'user_profile_img': img_useravatar.imageURL,
                'image': post.imageURL,
                'likes': True if user in post.liked.all() else False,
                'likes_count': post.total_likes(),
                'content': post.content,
                'created': post.created.strftime("%b. %d, %Y, %I:%M:%S %p"),
                'updated': post.updated.strftime("%b. %d, %Y, %I:%M:%S %p"),
                'comments': data_comments
            }
            data.append(posts)

    return JsonResponse({
        "data": data,
        "end_pagination": True if page_number >= paginator.num_pages else False,
        "user": main_user.id,
    })

def comment_post(request, id):
    main_user = request.user
    user = User.objects.get(id=main_user.id)

    if request.method == 'POST':
        post_id = Post.objects.get(id=id)
        data = json.loads(request.body)
        data_answer = data.get('body')
        
        new_comment = Comments.objects.create(user=user, post=post_id)
        new_comment.body = data_answer
        new_comment.save()

        for profile_image in new_comment.user.useravatar_set.all():
            profile_image.imageURL
        return JsonResponse({
            'id': new_comment.id,
            'user': new_comment.user.username,
            'user_id': new_comment.user.id,
            'profile_image': profile_image.imageURL,
            'body': new_comment.body
        })

@login_required(login_url='login')
def single_post_view(request, id):
    post = Post.objects.get(id=id)

    context = {'post': post}
    return render(request, "chatting/single_post.html", context)

@login_required(login_url='login')
def update_post(request, id):
    post = Post.objects.get(id=id)
    form = PostModelForm(instance=post)
    
    if request.method == 'POST':
        form = PostModelForm(request.POST or None, request.FILES or None, instance=post)
        if form.is_valid():
            edit_form = form.save(commit=False)
            edit_form.save()
            edit_form.liked.set(post.liked.all())
            return redirect("profile", request.user.id)

    context = {"form": form, 'post': post}
    return render(request, "chatting/edit_post.html", context)

def like_post(request, id):
    if request.method == 'POST':
        post = get_object_or_404(Post, id=id)
        like_bool = False

        if post.liked.filter(id=request.user.id).exists():
            post.liked.remove(request.user)
            like_bool = False
        else:
            post.liked.add(request.user)
            like_bool = True

        return JsonResponse({
            'like_bool': like_bool, 
            'count': post.total_likes()
        })

@login_required(login_url='login')
def delete_post(request, id):
    post = Post.objects.get(id=id)
    if request.method == 'POST':
        post.delete()
        return redirect("profile", request.user.id)

    context = {"post": post}

    return render(request, "chatting/delete_post.html", context)

@login_required(login_url='login')
def profile_view(request, id):
    if request.user.is_authenticated:
        user = User.objects.get(id=id)
        r_user = User.objects.get(id=request.user.id)

        # users = User.objects.all().exclude(id=r_user.id)
    
        followed_by_main_user = UserFollowing.objects.get(user=r_user)
        following_other_users = UserFollowing.objects.get(user=user)

        if user in followed_by_main_user.following_user_id.all():
            following_bool = True
        else:
            following_bool = False
        
        user_avatar = UserAvatar.objects.get(user=user)
        
        profile_post_form = PostModelForm(request.POST or None, request.FILES or None)

        if request.method == 'POST':
            data_answer = request.POST.get("content")
            data_image_answer = request.FILES.get("image")

            new_post = Post.objects.create(user=r_user)
            new_post.content = data_answer
            new_post.image = data_image_answer
            new_post.save()

            for user_profile_image in new_post.user.useravatar_set.all():
                user_profile_image.imageURL

            return JsonResponse({
                'main_user_id': r_user.id,
                'user_id': user.id,
                'id': new_post.id,
                'user': new_post.user.username,
                'post_user_id': new_post.user.id,
                'user_profile_image': user_profile_image.imageURL,
                'content': new_post.content,
                'image': new_post.imageURL,
                'likes': True if user in new_post.liked.all() else False,
                'likes_count': new_post.total_likes(),
                'created': new_post.created.strftime("%b. %d, %Y, %I:%M:%S %p"),
                'comments': ''
            })

        # Add the instance to form not keep creating UserAvatar queries
        form = UserAvatarModelForm(request.POST or None, request.FILES or None, instance=user_avatar)

        default_image = 'avatar.png'

        is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'

        posts = Post.objects.filter(user=user).all()
        page_number = int(request.GET.get('page', 1))
        paginator = Paginator(posts, 10)
        try:
            post_page = paginator.page(page_number)
        except EmptyPage:
            return JsonResponse({
                "end_pagination": True
            })
            
    if not is_ajax:
        context = {'user': user, 'r_user': r_user, 'followed_user': followed_by_main_user, 'count': following_other_users.total_following, 'followers': user.followers.all().count(), 'following_bool': following_bool, 'post_page': post_page, 'user_avatar': user_avatar, 'form': form, 'default_mage': default_image, 'profile_post_form': profile_post_form}
        return render(request, "chatting/profile.html", context)
    else:
        data = []

        for post_data in post_page:
            for img_useravatar in post_data.user.useravatar_set.all():
                img_useravatar.imageURL

            data_comments = []
            for comments in post_data.comments_set.all():
                for comment_user_profile in comments.user.useravatar_set.all():
                    comment_user_profile.imageURL

                comments_post = {
                    'comment_user_profile': comment_user_profile.imageURL,
                    'comment_user': comments.user.username,
                    'comments_user_id': comments.user.id,
                    'body': comments.body
                }
                data_comments.append(comments_post)

            all_user_posts = {
                'id': post_data.id,
                'user': post_data.user.username,
                'user_id': post_data.user.id,
                'user_profile_img': img_useravatar.imageURL,
                'image': post_data.imageURL,
                'likes': True if request.user in post_data.liked.all() else False,
                'likes_count': post_data.total_likes(),
                'content': post_data.content,
                'created': post_data.created.strftime("%b. %d, %Y, %I:%M:%S %p"),
                'updated': post_data.updated.strftime("%b. %d, %Y, %I:%M:%S %p"),
                'comments': data_comments
            }
            data.append(all_user_posts)
    return JsonResponse({
        "data": data,
        "end_pagination": True if page_number >= paginator.num_pages else False,
        "user": request.user.id,
    })

def change_avatar_profile(request):
    r_user = User.objects.get(id=request.user.id)
    if request.method == 'POST':
        avatar_image = request.FILES.get("avatar-image")
        new_avatar = UserAvatar.objects.get(user=r_user)

        if new_avatar.avatar != 'avatar.png':
            new_avatar.avatar.delete()

        new_avatar.avatar = avatar_image
        new_avatar.save()

        return JsonResponse({
            'new_avatar_image': new_avatar.imageURL
        })

def delete_avatar(request):
    r_user = request.user
    user = User.objects.get(id=r_user.id)
    user_avatar = UserAvatar.objects.get(user=user)
    
    if request.method == 'DELETE':
        if user_avatar.avatar != 'avatar.png':
            user_avatar.avatar.delete()
        
        user_avatar.avatar = 'avatar.png'
        user_avatar.save()
        
        return JsonResponse({
            'user': user.username,
            'default_image': user_avatar.imageURL
        })

def follow_unfollow(request, id):
    main_user = User.objects.get(id=request.user.id)
    other_user = User.objects.get(id=id)
    
    follow_user = UserFollowing.objects.get(user=main_user)
    
    if request.method == 'PUT':
        if other_user in follow_user.following_user_id.all():
            following_bool = False
            follow_user.following_user_id.remove(other_user)
        else:
            following_bool = True
            follow_user.following_user_id.add(other_user)
        
        return JsonResponse({
            "followers_bool": following_bool,
            "count": other_user.following.all().count(),
            "followers_count": other_user.followers.all().count()
        })

def delete_user(request):
    user = User.objects.get(id=request.user.id)
    print(f"User {user}")

    if request.method == 'POST':
        user.delete()
        return redirect("login")

    context = {"user": user}

    return render(request, "chatting/confirm-delete-page.html", context)




def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect("index")
        else:
            messages.error(request, "Invalid username or password.")
            return redirect("login")
    form = AuthenticationForm()

    context = {'form': form}
    return render(request, "chatting/login.html", context)

def register(request):
    if request.user.is_authenticated:
        return redirect("index")
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("login")
    else:
        form = CustomUserCreationForm()

    context = {'form': form}

    return render(request, 'chatting/register.html', context)

def logout_view(request):
    logout(request)
    return redirect("login")
