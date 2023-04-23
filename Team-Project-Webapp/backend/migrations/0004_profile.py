# Generated by Django 4.1.7 on 2023-04-23 13:27

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('backend', '0003_alter_review_user_itinerary'),
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(blank=True, max_length=255)),
                ('last_name', models.CharField(blank=True, max_length=255)),
                ('age', models.IntegerField(blank=True, null=True)),
                ('budget', models.DecimalField(blank=True, decimal_places=0, max_digits=10, null=True)),
                ('dietary_restrictions', models.CharField(blank=True, choices=[('Halal', 'Halal'), ('Vegan', 'Vegan'), ('Vegetarian', 'Vegetarian'), ('Kosher', 'Kosher'), ('Carnivore', 'Carnivore')], max_length=100, null=True)),
                ('accessibility_needs', models.CharField(blank=True, choices=[('Impaired vision', 'Impaired vision'), ('Impaired hearing', 'Impaired hearing'), ('Wheel-chair bound', 'Wheel-chair bound')], max_length=100, null=True)),
                ('preferences', models.CharField(blank=True, max_length=100, null=True)),
                ('profile_picture', models.ImageField(blank=True, upload_to='profile_pictures')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
