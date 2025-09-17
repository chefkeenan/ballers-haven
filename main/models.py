import uuid
from django.db import models


# Create your models here.

class Product(models.Model):
    category_choices = [
        ('merchandise', 'Merchandise'),
        ('accessories', 'Accessories'),
        ('shoe', 'Shoe'),
        ('jersey', 'Jersey'),
        ('ball', 'Ball'),
        ('player', 'Player')
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    price = models.IntegerField()
    description = models.TextField()
    stock = models.IntegerField()
    thumbnail = models.URLField()
    category = models.CharField(max_length=20, choices=category_choices)
    is_featured = models.BooleanField(default=False)

    def __str__(self):
        return self.name
    