# Generated by Django 5.1.3 on 2025-04-15 22:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_userreview'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='UserReview',
            new_name='Reviews',
        ),
    ]
