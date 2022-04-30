from django.urls import path
from .views import index, update_post, delete_post, login_view, register, logout_view, single_post_view, profile_view, like_post, follow_unfollow, delete_avatar, comment_post

urlpatterns = [
    path("", index, name="index"),
    path("comments/<int:id>", comment_post, name="comments"),
    path("single-post/<int:id>", single_post_view, name="single-post"),
    path("update-post/<int:id>/", update_post, name="update-post"),
    path("like-post/<int:id>/", like_post, name="like-post"),
    path("delete-post/<int:id>", delete_post, name="delete-post"),
    path('profile/<int:id>', profile_view, name="profile"),
    path('delete-avatar<int:id>', delete_avatar, name='delete-avatar'),
    path("follow-unfollow/<int:id>", follow_unfollow, name="follow-unfollow"),
    path("login/", login_view, name="login"),
    path("register/", register, name="register"),
    path("logout/", logout_view, name="logout"),
]
