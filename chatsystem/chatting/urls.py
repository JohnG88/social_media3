from django.urls import path
from .views import index, update_post, delete_post

urlpatterns = [
    path("", index, name="index"),
    path("update-post/<int:id>/", update_post, name="update-post"),
    path("delete-post/<int:id>", delete_post, name="delete-post")
]
