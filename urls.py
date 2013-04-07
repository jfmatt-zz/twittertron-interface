from django.conf.urls.defaults import patterns, url, include

urlpatterns = patterns('',
    url(r'^home/$', 'transit.views.home', name='home'),
    url(r'^tweets/', include('tweets.urls')),
)
