from django.shortcuts import render
from .models import Post
from .forms import PostModelForm

# Create your views here.

def index(request):
    form = PostModelForm(request.POST or None, request.FILES or None)
    
    if request.method == 'POST':
        if form.is_valid():
            form.save()

    all_posts = Post.objects.all()

    context = {'all_posts': all_posts, 'form': form}
    return render(request, "chatting/index.html", context)
