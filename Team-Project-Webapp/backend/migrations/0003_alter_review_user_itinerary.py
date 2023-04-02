# Generated by Django 4.1.7 on 2023-03-27 22:04

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('backend', '0002_alter_review_rating_alter_review_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='review',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='Itinerary',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('destination', models.CharField(max_length=100)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('budget', models.DecimalField(decimal_places=0, max_digits=10)),
                ('dietary_restrictions', models.CharField(choices=[('Halal', 'Halal'), ('Vegan', 'Vegan'), ('Vegetarian', 'Vegetarian'), ('Kosher', 'Kosher'), ('Carnivore', 'Carnivore')], default='No dietary restrictions', max_length=100)),
                ('accessibility_needs', models.CharField(choices=[('Impaired vision', 'Impaired vision'), ('Impaired hearing', 'Impaired hearing'), ('Wheel-chair bound', 'Wheel-chair bound')], default='No accessibility needs', max_length=100)),
                ('preferences', models.CharField(max_length=100)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]