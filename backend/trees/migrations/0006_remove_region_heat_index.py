# Generated by Django 5.1.3 on 2025-04-10 20:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('trees', '0005_region_heat_index_region_name_ru_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='region',
            name='heat_index',
        ),
    ]
