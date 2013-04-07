# Python
import simplejson as json
from datetime import datetime

# Django
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.db.models import Count

# Local
import tweets.models as models


def main(request):
    getdict = dict(request.GET.iterlists())
    for k in getdict.keys():
        l = len(getdict[k])
        if l == 1:
            getdict[k] = getdict[k][0]
        elif l == 0:
            del getdict[k]
    if 'hashtags[]' in getdict:
        getdict['hashtags'] = getdict['hashtags[]']
        del getdict['hashtags[]']

    return render_to_response(
        "tweets/index.html",
        {
            'query': json.dumps(getdict),
            'data': tweetsToJson(getTweets(**getdict)),
            'hashes': models.Hashtag.objects.values('hashtag').annotate(count=Count('hashtag')).filter(count__gte=3).order_by()
        }
    )


def ajax(request):
    getdict = dict(request.GET.iterlists())
    for k in getdict.keys():
        l = len(getdict[k])
        if l == 1:
            getdict[k] = getdict[k][0]
        elif l == 0:
            del getdict[k]
    if 'hashtags[]' in getdict:
        getdict['hashtags'] = getdict['hashtags[]']
        del getdict['hashtags[]']

    # return HttpResponse(request.GET['start'])
    return HttpResponse(tweetsToJson(getTweets(**getdict)))


def tweetsToJson(tweets):
    l = list(tweets)
    return json.dumps({
        'max': max(min(len(l) / 3, 5), 1),
        'lastid': str(l[-1].id) if len(l) > 0 else 0,
        'data': map(
            lambda t: {
                'lat': t.loc_lat,
                'lng': t.loc_long,
                'count': 2 if t.mood == 3 else 1
            },
            filter(lambda el: el, list(tweets))
        )
    })


def getTweets(limit=100, start=None, hashtags=[], mentions=[], userid='', starttime=None, endtime=None):

    # Must have location
    tweets = models.Tweet.objects.exclude(loc_lat__isnull=True).exclude(loc_long__isnull=True)

    # Paging
    tweets.order_by('id')
    if start is not None:
        tweets = tweets.filter(id__gt=start)

    # Match any hashtags
    if isinstance(hashtags, basestring):
        tweets = tweets.filter(hashtag__hashtag=hashtags).distinct()
    elif len(hashtags) > 0:
        tweets = tweets.filter(hashtag__hashtag__in=hashtags).distinct()

    # Match all mentions
    for mention in mentions:
        tweets = tweets.filter(mentions__exact=mention).distinct()

    # Match the given user
    if userid != '':
        tweets = tweets.filter(userid__userid__exact=userid)

    # Limit times
    if starttime is not None:
        tweets = tweets.filter(date__gte=datetime.fromtimestamp(int(starttime)))
    if endtime is not None:
        tweets = tweets.filter(date__lte=datetime.fromtimestamp(int(endtime)))

    return tweets
