from django.urls import path
from .views import index, update_post, delete_post, login_view, register, logout_view

urlpatterns = [
    path("", index, name="index"),
    path("update-post/<int:id>/", update_post, name="update-post"),
    path("delete-post/<int:id>", delete_post, name="delete-post"),
    path("login/", login_view, name="login"),
    path("register/", register, name="register"),
    path("logout/", logout_view, name="logout"),
]
