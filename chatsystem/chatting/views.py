from django.shortcuts import render

# Create your views here.

def index(request):
    hello = "Hello World"
    
    context = {'hello': hello}
    return render(request, "chatting/index.html", context)
