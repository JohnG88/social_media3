from django.urls import path
from .views import index, update_post, delete_post, login_view, register, logout_view, single_post_view, profile_view, like_post

urlpatterns = [
    path("", index, name="index"),
    path("single-post/<int:id>", single_post_view, name="single-post"),
    path("update-post/<int:id>/", update_post, name="update-post"),
    path("like-post/<int:id>", like_post, name="like-post"),
    path("delete-post/<int:id>", delete_post, name="delete-post"),
    path('profile/<int:id>', profile_view, name="profile"),
    path("login/", login_view, name="login"),
    path("register/", register, name="register"),
    path("logout/", logout_view, name="logout"),
]
