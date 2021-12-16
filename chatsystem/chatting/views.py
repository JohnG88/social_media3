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
