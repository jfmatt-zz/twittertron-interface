from django.conf.urls.defaults import patterns, url

urlpatterns = patterns('',
    url(r'^$', 'tweets.views.main', name='tweets-main'),
    url(r'^ajax/$', 'tweets.views.ajax', name='tweets-ajax'),
)
