# Generated by Django 4.1.7 on 2023-05-02 09:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0011_alter_itinerary_dietary_restrictions_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='review',
            name='comment',
            field=models.TextField(max_length=150),
        ),
    ]