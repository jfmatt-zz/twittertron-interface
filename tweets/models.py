from django.db import models


class User(models.Model):
    userid = models.BigIntegerField(primary_key=True)
    user = models.CharField(max_length=100)
    username = models.CharField(max_length=100)

    class Meta:
        db_table = 'user'


# Create your models here.
class Tweet(models.Model):
    id = models.BigIntegerField(primary_key=True)
    date = models.BigIntegerField()
    userid = models.ForeignKey(User, db_column='userid', related_name='userid_rel')
    loc_name = models.CharField(max_length=100)
    loc_lat = models.DecimalField(max_digits=11, decimal_places=8)
    loc_long = models.DecimalField(max_digits=11, decimal_places=8)
    text = models.CharField(max_length=200)
    mood = models.IntegerField()
    mentions = models.ManyToManyField(User, db_table='mention', related_name='mention_rel')

    class Meta:
        db_table = 'tweet'


class Hashtag(models.Model):
    id = models.ForeignKey(Tweet, primary_key=True, db_column='id')  # Calling this a PK is a little white lie to make Django happy
    hashtag = models.CharField(max_length=50)

    class Meta:
        db_table = 'hashtag'
