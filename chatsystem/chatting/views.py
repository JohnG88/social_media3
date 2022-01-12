from django.http.response import HttpResponseRedirect, JsonResponse
from django.shortcuts import redirect, render,get_object_or_404
from django.contrib import messages
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.urls import reverse
from .models import Post, UserFollowing
from .forms import PostModelForm, EditPostModelForm, CustomUserCreationForm

# Create your views here.

@login_required(login_url='login')
def index(request):
    if request.user.is_authenticated:
        user = request.user
        # print(f"INdex user {user}")
        form = PostModelForm(request.POST or None, request.FILES or None)
        
        if request.method == 'POST':
            if form.is_valid():
                user_form = form.save(commit=False)
                user_form.user = user
                form.save()
                return redirect("index")

        all_posts = Post.objects.all()
        
    
    context = {'all_posts': all_posts, 'form': form, 'user': user}
    return render(request, "chatting/index.html", context)

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
    post = get_object_or_404(Post, id=request.POST.get('post_id'))
    like_bool = False
    if post.liked.filter(id=request.user.id).exists():
        post.liked.remove(request.user)
        like_bool = False
    else:
        post.liked.add(request.user)
        like_bool = True
    return redirect("index")

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
        print(f"Profile user {user}")
        main_user = UserFollowing.objects.get(user=request.user)
        print(f"Main user {main_user}")
        all_followers = request.user.followers.all()
        print(f"{main_user} following {all_followers}")
        following_bool = False
        followed_user = UserFollowing.objects.get(user=user)
        print(f"this is followed user {followed_user}")
        if user in main_user.following_user_id.all():
        # if main_user.following_user_id.filter(user=followed_user).exists():
            following_bool = True
        else:
            following_bool = False
        print(f"This is the followed user boolean {following_bool}")

        posts = Post.objects.filter(user=user).all()

    context = {'user': user, 'followed_user': followed_user, 'count': followed_user.total_followers, 'following': user.followers.all().count(), 'follow_bool': following_bool, 'posts': posts}
    return render(request, "chatting/profile.html", context)

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
