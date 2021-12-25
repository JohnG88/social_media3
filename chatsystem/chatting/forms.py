from django import forms
from django.forms.forms import Form
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User 
from django.core.exceptions import ValidationError
from django.utils.encoding import force_str
from django.forms.fields import EmailField
from django.utils.html import format_html
from .models import Post

# For rendering custom ClearableFileInput
from django.forms.widgets import ClearableFileInput

class MyImageWidget(ClearableFileInput):
    template_name = "chatting/custom_form.html"

    def render(self, name, value, attrs=None, render=None):
            if value and hasattr(value, "url"):
                template = self.template_with_initialsubstitutions['initial'] = format_html(self.url_markup_template, value.url,force_str(value))




class PostModelForm(forms.ModelForm):
    class Meta:
        model = Post
        exclude = ('user', 'created', 'updated')

class EditPostModelForm(forms.ModelForm):
    image = forms.ImageField(widget=MyImageWidget)
    class Meta:
        model = Post
        exclude = ('user','created', 'updated')

        

# class LoginModelForm(forms.ModelForm):
#     class Meta:
#         model = User
#         exclude = ()

# class CreateUserform(UserCreationForm):
#     class Meta:
#         model = User
#         exclude = ('groups', 'user_permissions', 'is_staff', 'is_active', 'is_superuser', 'last_login', 'date_joined')

# Beefed out Custom register form

class CustomUserCreationForm(UserCreationForm):
    username = forms.CharField(label='Username', min_length=5, max_length=100)
    email = forms.EmailField(label='Email')
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Confrim Password', widget=forms.PasswordInput)

    def username_clean(self):
        username = self.cleaned_data['username'].lower()
        new = User.objects.filter(username=username)
        if new.exists():
            raise ValidationError("User Already Exists")
        return username

    def email_clean(self):
        email = self.cleaned_data['email'].lower()
        new = User.objects.filter(email=email)
        if new.exists():
            raise ValidationError("Email Already Exists.")
        return email

    def clean_password2(self):
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