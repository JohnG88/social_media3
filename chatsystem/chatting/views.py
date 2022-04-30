from django.http.response import HttpResponseRedirect, JsonResponse
from django.shortcuts import redirect, render,get_object_or_404
from django.contrib import messages
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import AuthenticationForm
import json
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.paginator import Paginator
from django.db.models import Q
from django.template.loader import render_to_string
from django.urls import reverse
from .models import Post, UserFollowing, UserAvatar, Comments
from .forms import PostModelForm, UserAvatarModelForm, CustomUserCreationForm, CommentsModelForm, ProfilePostModelForm

import random

# Create your views here.

@login_required(login_url='login')
def index(request):
    # post = Post.objects.all()
    if request.user.is_authenticated:
        main_user = request.user
        user = User.objects.get(id=main_user.id)
        # print(f"INdex user {user}")
        form = PostModelForm()

        # is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'

        if request.method == 'POST':
            # if 'submit_p_form' in request.POST:
            data_answer = request.POST.get("content");
            data_image_answer = request.FILES.get("image")
            # form = PostModelForm(request.POST or None, request.FILES or None)
            # data = json.loads(request.body)
            # data = json.loads(request.body)
            # data_answer = data.get('content')
            # data_image_answer = data.get('image')
            # print(f"Data raw {data}")
            print(f"Data answer {data_answer}")
            print(f"Data image answer {data_image_answer}")
        # print(f"Request post data {request.POST.get('data')}")
            # if form.is_valid():
                # print(f"Request post data {request.POST.get('data')}")
                # user_form = form.save(commit=False)
                # user_form.user = user.id
                # user_form.content = data.get('content')
                # user_form.save()
                # form = PostModelForm()
                # return redirect('index')
            new_post = Post.objects.create(user=user)
            # new_post = Post(user=user.id, content=data_answer)
            # new_post.user = user.id
            new_post.content = data_answer
            new_post.image = data_image_answer
            new_post.save()
            
            for user_profile_image in new_post.user.useravatar_set.all():
                user_profile_image.imageURL
            
            # post_data_comments = []
            # for post_comments in new_post.comments_set.all():
            #     for user_comments_profile_image in post_comments.user.useravatar_set.all():
            #         user_comments_profile_image.imageURL

            #     single_post_comments = {
            #         'comment_user_profile': user_comments_profile_image.imageURL,
            #         'comment_user': post_comments.user.username,
            #         'body': comments.body
            #     }
            #     post_data_comments.append(single_post_comments)

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
                    
        
        # comment_form = CommentsModelForm(request.POST or None)
        # if 'submit_c_form' in request.POST:
        #     if request.method == 'POST':
        #         print(f"Comment post id {request.POST.get('comment_post_id')}")
        #         # try:
        #         #     post_id = Post.objects.get(id=request.POST.get('comment_post_id'))
        #         # except Post.DoesNotExist:
        #         #     post_id = None
        #         post_id = Post.objects.get(id=request.POST.get('comment_post_id'))
        #         if comment_form.is_valid():
        #             instance = comment_form.save(commit=False)
        #             instance.user = main_user
        #             instance.post = post_id
        #             instance.save()
        #             comment_form = CommentsModelForm()
        #             # return redirect('index')

                # post_comments, created = Comments.objects.get_or_create(user=user, post=post_id)
                # print(f"Post comments {post_comments}")

        # all_posts_images = Post.objects.filter("image");
        # print(f"Post image {all_posts_images}")
        
        
        is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
        # created the request.user query for UserFollowing
        followed_profiles = UserFollowing.objects.get(user=request.user)
        # print(f"followed Profiles {followed_profiles}")

        all_followed_profiles = followed_profiles.following_user_id.all()
        # print(f"all_followed_profiles {all_followed_profiles}")

        all_followed_users_tables = UserFollowing.objects.all()
        # print(f"All followed Users {all_followed_users_tables}")

        
        # queried the user from posts and linked it to followers from UserFollowing's following_user_id's related name and instanced followed_profiles to it 
        # using .distinct() helps eliminate duplicate values
        follower_user_posts = Post.objects.filter(Q(user__followers=followed_profiles) | Q(user=main_user)).distinct()
        # print(f"Follower Ids {follower_user_posts}")
        data_page_num = request.GET.get('page')
        # print(f"Data page Num {data_page_num}")
        page_number = int(request.GET.get('page', 1))
        # print(f'Page Number {page_number}')
        paginator = Paginator(follower_user_posts, 10)

        try:
            post_page = paginator.page(page_number)
        except paginator.EmptyPage:
            post_page = paginator.Page([], page_number, paginator)

        # page_obj = paginator.get_page(page_number)
        # print(f'Pagination Post {paginator}')

        # profiles = Profile.objects.all().exclude(user=self.user)
        users = User.objects.all().exclude(id=main_user.id)
        # print(f"Users {users}")

        user_avatars = UserAvatar.objects.all()
        # for ua in user_avatars:
        #     print(f"ua {ua.avatar}")
        # print(f"user_avatars {user_avatars}")

        # I still don't know how list comprehensions work, I tweaked one example I copied from a tutorial, It seems to be working 
        available = [user for user in users if user not in all_followed_profiles]
        # print(f"Available {available}")
        random.shuffle(available)

        # user_posts = Post.objects.filter(user=request.user).all()

        # followed_profiles = user.followers.all()
        # all_followed_profiles_posts = Post.objects.filter(user_id__in=followed_profiles).all()
        # followed_profiles = user.followers.all()
        # print(f"Followed Profiles {followed_profiles}")
        # followed_profiles_posts = Post.objects.filter(user__in=followed_profiles).all()
        
    if not is_ajax:
        context = {'follower_user_posts': follower_user_posts, 'all_followed_profiles': all_followed_profiles, 'form': form, 'user': user, 'available': available[:3], 'post_page': post_page}
        return render(request, "chatting/index.html", context)
    
    # This block below will get everything from a template and convert into a string to use for scroll
    else:
        # content = ''
        # for post in post_page:
        #     content += render_to_string("chatting/index.html", {'post': post}, request=request)
        # 'image': post.image.url,
        # 'liked': post.liked,
        # all_users = User.objects.all()
        # for users in all_users:
        #     users.comments_set.filter()
        # all_posts = Post.objects.all()
        # indiv_post_comments = all_posts.comments_set.all()
        # for user_comments in all_posts.comments_set.all():
        #     print(f"All comments {user_comments.body}")
        #     user_comments.body
        # print(f"All posts {all_posts}")
        
        
        # print(f"Comments {comments}")
    
        data = []

        for post in post_page:
            for img_useravatar in post.user.useravatar_set.all():
                print(f" IMG AVA {img_useravatar.imageURL}")
                img_useravatar.imageURL

            # for post_comments in post.user.comments_set.filter(id=post.id):
            #     print(f"Post comments {post_comments.body}")

            # all_users = User.objects.all()
            # for users in all_users:
            #     print(f"Users {users}")
            #     users.comments_set.all()
            #     print(f"All comments {users.comments_set.all()}")
            #     if users.comments_set.filter(user=post.user):
            #         for user_comments in users.comments_set.filter(post=post.id):
            #                 print(f"User comments{user_comments.body}")
            #                 # user_comments
            #     return user_comments
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
                'updated': post.updated,
                'comments': data_comments
            }
            data.append(posts)
            # print(f"Data: {data}")

    return JsonResponse({
        # 'id': new_post.id,
        # 'user': new_post.user.username,
        # 'content': new_post.content,
        # 'image': new_post.imageURL,
        # 'created': new_post.created,
        "data": data,
        "end_pagination": True if page_number >= paginator.num_pages else False,
        "user": main_user.id
    })

def comment_post(request, id):
    # post = get_object_or_404(Post, id=request.POST.get('post_id'))
    main_user = request.user
    user = User.objects.get(id=main_user.id)
    # comment_form = CommentsModelForm()
    # if 'submit_c_form' in request.POST:
    if request.method == 'POST':
        print(f"Comment post id {request.POST.get('comment_post_id')}")
        # try:
        post_id = Post.objects.get(id=request.POST.get('comment_post_id'))
        # except Post.DoesNotExist:
        #     post_id = None
        body = request.POST.get("body")
        # if comment_form.is_valid():
        #     instance = comment_form.save(commit=False)
        #     instance.user = main_user
        #     instance.post = post_id
        #     instance.save()
            # comment_form = CommentsModelForm()
            # return redirect('index')
        new_comment = Comments.objects.create(user=user, post=post_id)
        new_comment.body = body
        new_comment.save()
        return redirect('index')
    # context = {'comment_form': comment_form}
    # return render(request, "chatting/index.html", context)

@login_required(login_url='login')
def single_post_view(request, id):
    post = Post.objects.filter(id=id)

    context = {'post': post}
    return render(request, "chatting/single_post.html", context)

@login_required(login_url='login')
def update_post(request, id):
    post = Post.objects.get(id=id)
    content = post.content
    image = post.image
    form = PostModelForm(request.POST or None, request.FILES or None, instance=post)

    # form = EditPostModelForm(request.POST or None, request.FILES or None, instance=post)
    
    if request.method == 'POST':
        if form.is_valid():
            form.save()
            return redirect("index")

    context = {"form": form}
    return render(request, "chatting/edit_post.html", context)

# def like_post(request, id):
#     if request.method == 'POST':
#         user = request.user
#         id = request.POST.get('post_id')
#         print(f"id {id}")
#         post = Post.objects.get(id=id)

#         if user in post.liked.all():
#             liked = False
#             post.liked.remove(user)
#         else:
#             liked = True
#             post.liked.add(user)
#     # return JsonResponse({'liked': liked, 'count': post.total_likes})
#     return render(request, "chatting/index.html", {"liked": liked})

def like_post(request, id):
    # post = get_object_or_404(Post, id=request.POST.get('post_id'))
    # is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
    if request.method == 'POST':
    # if is_ajax:
        post = get_object_or_404(Post, id=id)
        # post = request.POST.get("id")
        print(f"Post {post}")
        like_bool = False
        if post.liked.filter(id=request.user.id).exists():
            post.liked.remove(request.user)
            like_bool = False
        else:
            post.liked.add(request.user)
            like_bool = True
        # return redirect("index")
        return JsonResponse({
            'like_bool': like_bool, 
            'count': post.total_likes()
        })

@login_required(login_url='login')
def delete_post(request, id):
    post = Post.objects.get(id=id)
    if request.method == 'POST':
        post.delete()
        return redirect("index")

    context = {"post": post}

    return render(request, "chatting/delete_post.html", context)

@login_required(login_url='login')
def profile_view(request, id):
    if request.user.is_authenticated:
        user = User.objects.get(id=id)
        # print(f"Profile user {user}")
        main_user = UserFollowing.objects.get(user=request.user)
        # print(f"Main user {main_user}")
        all_followers = request.user.followers.all()
        # print(f"{main_user} following {all_followers}")
        following_bool = False
        followed_user = UserFollowing.objects.get(user=user)
        # print(f"this is followed user {followed_user}")
        if user in main_user.following_user_id.all():
        # if main_user.following_user_id.filter(user=followed_user).exists():
            following_bool = True
        else:
            following_bool = False
        # print(f"This is the followed user boolean {following_bool}")
        
        r_user = User.objects.get(id=request.user.id)
        # print(f"r_user {r_user}")
        user_avatar = UserAvatar.objects.get(user=user)
        # print(f"User Avatar {user_avatar}" )
        
        # for some reason post worked by moving it above UserAvatarModelForm, idk why that is, it doesn't work if placed below UserAvatarModelForm
        profile_post_form = PostModelForm(request.POST or None, request.FILES or None)
        # print(f"post model form {profile_post_form}")

        if request.method == 'POST':
            if profile_post_form.is_valid():
                post_form = profile_post_form.save(commit=False)
                post_form.user = r_user
                profile_post_form.save()
                # post_form = PostModelForm()
                return HttpResponseRedirect(reverse('profile', args=[id]))
        
        # Add the instance to form not keep creating UserAvatar queries
        form = UserAvatarModelForm(request.POST or None, request.FILES or None, instance=user_avatar)

        if request.method == 'POST':
            if form.is_valid():
                user_avatar_form = form.save(commit=False)
                user_avatar_form.user = r_user
                form.save()
                return HttpResponseRedirect(reverse('profile', args=[id]))

        default_image = 'avatar.png'

        posts = Post.objects.filter(user=user).all()
        # Idk if this is standard but it created the UserAvatar queries for each existing user(already created a signal to create the queries each time a user registers, so I commented it out)
        # users = User.objects.all()
        # for user in users:
        #     UserAvatar.objects.create(user=user)
            

    context = {'user': user, 'followed_user': followed_user, 'count': followed_user.total_followers, 'following': user.followers.all().count(), 'follow_bool': following_bool, 'posts': posts, 'user_avatar': user_avatar, 'form': form, 'default_mage': default_image, 'profile_post_form': profile_post_form}
    return render(request, "chatting/profile.html", context)

def delete_avatar(request, id):
    r_user = request.user
    user = User.objects.get(id=r_user.id)
    user_avatar = UserAvatar.objects.get(user=user)
    if request.method == 'POST':
        user_avatar.avatar.delete()
        user_avatar.avatar = 'avatar.png'
        user_avatar.save()
        return HttpResponseRedirect(reverse('profile', args=[id]))

def follow_unfollow(request, id):
    other_user = User.objects.get(id=id)
    # print(f"Other user {other_user}")
    follow_user = UserFollowing.objects.get(user=request.user)
    # print(f"following user {follow_user}")

    if other_user in follow_user.following_user_id.all():
        # followers = False
        follow_user.following_user_id.remove(other_user)
    else:
        # followers = True
        follow_user.following_user_id.add(other_user)
    follow_user.save()
    # to reference attribute/field from same model use its name
    # ex follow_user is variable of UserFollowing and UserFollowing, and you can use lines such as below,
    # follow_user.following_user_id.all()
    # to reference attribute/field from another model and you have a related name in that field you can just use  a variable that has another model and use that related_name
    # user.followers.all()
    # And if you do not have a related_name you can just use variable lowercase name of model _set
    # user.userfollowing_set.all()
    
    
    return HttpResponseRedirect(reverse('profile', args=[id]))



def login_view(request):
    # if request.user.is_authenticated:
    #     return redirect("index")
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                messages.info(request, f"You are now logged in as {username}.")
                return redirect("index")
            else:
                messages.error(request, "Invalid username or password.")
        else:
            messages.error(request, "Invalid username or password.")
    else:
        messages.error(request, "Invalid username or password.")
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
