#!/usr/bin/python

#From http://wiki.alwaysdata.com/wiki/Deploying_a_Django_App

import sys, os

_PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
print _PROJECT_DIR
sys.path.insert(0, _PROJECT_DIR)
sys.path.insert(0, os.path.dirname(_PROJECT_DIR))

_PROJECT_NAME = _PROJECT_DIR.split('/')[-1]
os.environ['DJANGO_SETTINGS_MODULE'] = "%s.settings" % _PROJECT_NAME

sys.stderr.write(_PROJECT_DIR + "\n")
sys.stderr.write(_PROJECT_NAME + "\n")
sys.stderr.write(str(sys.path) + "\n")
sys.stderr.flush()

from django.core.servers.fastcgi import runfastcgi
runfastcgi(method="threaded", daemonize="false")

