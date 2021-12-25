from django.urls import path
from .views import index, update_post, delete_post, login_view, register, logout_view, single_post_view

urlpatterns = [
    path("", index, name="index"),
    path("single-post/<int:id>", single_post_view, name="single-post"),
    path("update-post/<int:id>/", update_post, name="update-post"),
    path("delete-post/<int:id>", delete_post, name="delete-post"),
    path("login/", login_view, name="login"),
    path("register/", register, name="register"),
    path("logout/", logout_view, name="logout"),
]
