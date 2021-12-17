from django.shortcuts import redirect, render
from .models import Post
from .forms import PostModelForm

# Create your views here.

def index(request):
    form = PostModelForm(request.POST or None, request.FILES or None)
    
    if request.method == 'POST':
        if form.is_valid():
            form.save()
            return redirect("index")

    all_posts = Post.objects.all()

    context = {'all_posts': all_posts, 'form': form}
    return render(request, "chatting/index.html", context)

def update_post(request, id):
    post = Post.objects.get(id=id)
    content = post.content
    image = post.image

    form = PostModelForm(request.POST or None, request.FILES or None, instance=post)
    
    if request.method == 'POST':
        if form.is_valid():
            form.save()
            return redirect("index")

    context = {"form": form}
    return render(request, "chatting/edit_post.html", context)

def delete_post(request, id):
    post = Post.objects.get(id=id)
    if request.method == 'POST':
        post.delete()
        return redirect("index")

    context = {"post": post}

    return render(request, "chatting/delete_post.html", context)