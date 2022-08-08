from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User 
from django.core.exceptions import ValidationError
from .models import Post, UserAvatar, Comments

class PostModelForm(forms.ModelForm):
    class Meta:
        model = Post
        exclude = ('user', 'created', 'updated')

class CommentsModelForm(forms.ModelForm):
    class Meta:
        model = Comments
        exclude = ('user', 'post', 'created', 'updated')

class EditPostModelForm(forms.ModelForm):
    class Meta:
        model = Post
        exclude = ('user','created', 'updated')

class ProfilePostModelForm(forms.ModelForm):
    class Meta:
        model = Post
        exclude = ('user', 'created', 'updated')        

class CustomUserCreationForm(UserCreationForm):
    username = forms.CharField(label='Username', min_length=5, max_length=100)
    email = forms.EmailField(label='Email')
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Confrim Password', widget=forms.PasswordInput)

    def clean_username(self):
        username = self.cleaned_data['username']
        new = User.objects.filter(username=username)
        if new.count():
            raise ValidationError("User Already Exists")
        return username

    def clean_email(self):
        email = self.cleaned_data['email']
        new = User.objects.filter(email=email)
        if new.count():
            raise ValidationError("Email Already Exists.")
        return email

    def password2_clean(self):
        password1 = self.cleaned_data['password1']
        password2 = self.cleaned_data['password2']

        if password1 and password2 and password1 != password2:
            raise ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        user = User.objects.create_user(
            self.cleaned_data['username'],
            self.cleaned_data['email'],
            self.cleaned_data['password1']
        )

        return user

class UserAvatarModelForm(forms.ModelForm):
    class Meta:
        model = UserAvatar
        exclude = ('user',)