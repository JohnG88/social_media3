# Generated by Django 4.0 on 2022-05-30 23:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chatting', '0015_alter_useravatar_avatar'),
    ]

    operations = [
        migrations.AlterField(
            model_name='useravatar',
            name='avatar',
            field=models.ImageField(default='avatar.png', upload_to='avatars'),
        ),
    ]