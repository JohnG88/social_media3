from django.http.response import HttpResponseRedirect
from django.shortcuts import redirect, render
from django.contrib import messages
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.urls import reverse
from .models import Post
from .forms import PostModelForm, EditPostModelForm, CustomUserCreationForm

# Create your views here.

@login_required(login_url='login')
def index(request):
    user = request.user
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

@login_required(login_url='login')
def delete_post(request, id):
    post = Post.objects.get(id=id)
    if request.method == 'POST':
        post.delete()
        return redirect("index")

    context = {"post": post}

    return render(request, "chatting/delete_post.html", context)

def profile_view(request, id):
    user = User.objects.get(id=id)
    print(f"This is the user {user}")

    context = {'user': user}
    return render(request, "chatting/profile.html", context)

def login_view(request):
    if request.user.is_authenticated:
        return redirect("index")
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
