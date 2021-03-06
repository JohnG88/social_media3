# Generated by Django 4.0 on 2022-05-10 02:02

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('chatting', '0013_alter_comments_body'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userfollowing',
            name='following_user_id',
            field=models.ManyToManyField(blank=True, related_name='followers', to=settings.AUTH_USER_MODEL),
        ),
    ]
