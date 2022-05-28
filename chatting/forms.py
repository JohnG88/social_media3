from django import forms
from django.forms.forms import Form
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User 
from django.core.exceptions import ValidationError
from django.utils.encoding import force_str
from django.forms.fields import EmailField, ImageField
from django.utils.html import format_html
from .models import Post, UserAvatar, Comments

# For rendering custom ClearableFileInput
from django.forms.widgets import ClearableFileInput

# class ProfileImageWidget(ClearableFileInput):
#     checkbox_name = ''
#     initial_text = ''
#     input_text = ''
#     clear_checkbox_label = ''

# class MyImageWidget(ClearableFileInput):
#     # template_name = "chatting/custom_form.html"
#     template_with_initial = (
#         '%(initial_text)s: <a href="%(initial_url)s">%(initial)s</a> '
#         '%(clear_template)s<br />%(input_text)s: %(input)s'
#     )

#     template_with_clear = '%(clear)s <label for="%(clear_checkbox_id)s">%(clear_checkbox_label)s</label>'

#     def render(self, name, value, attrs=None, render=None):
#             if value and hasattr(value, "url"):
#                 template = self.template_with_initialsubstitutions['initial'] = format_html(self.url_markup_template, value.url,force_str(value))




class PostModelForm(forms.ModelForm):
    class Meta:
        model = Post
        exclude = ('user', 'created', 'updated')

class CommentsModelForm(forms.ModelForm):
    class Meta:
        model = Comments
        exclude = ('user', 'post', 'created', 'updated')

class EditPostModelForm(forms.ModelForm):
    # image = forms.ImageField(widget=MyImageWidget)
    class Meta:
        model = Post
        exclude = ('user','created', 'updated')

class ProfilePostModelForm(forms.ModelForm):
    # avatar = ImageField(widget=MyImageWidget)
    class Meta:
        model = Post
        exclude = ('user', 'created', 'updated')        

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

    def clean_username(self):
        # can add .lower at end of ['username']/ ['email'] to have whole username lowercased, can also be used with email, i don't know how to implement it 
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