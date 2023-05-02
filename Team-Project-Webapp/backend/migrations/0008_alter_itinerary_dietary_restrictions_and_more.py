# Generated by Django 4.1.7 on 2023-05-02 06:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0007_remove_itinerary_budget_remove_profile_budget'),
    ]

    operations = [
        migrations.AlterField(
            model_name='itinerary',
            name='dietary_restrictions',
            field=models.CharField(choices=[('No Dietary Restriction', 'No Dietary Restriction'), ('halal', 'Halal Restaurants'), ('Vegan Restaurants', 'Vegan'), ('Kosher Restaurants', 'Kosher Restaurants')], default='No Dietary Restriction', max_length=100),
        ),
        migrations.AlterField(
            model_name='profile',
            name='dietary_restrictions',
            field=models.CharField(blank=True, choices=[('No Dietary Restriction', 'No Dietary Restriction'), ('halal', 'Halal Restaurants'), ('Vegan Restaurants', 'Vegan'), ('Kosher Restaurants', 'Kosher Restaurants')], max_length=100, null=True),
        ),
    ]
