#!/usr/bin/env python
import os
import StringIO
import signal
import subprocess
import sys
import time
import threading
import urllib2
import webbrowser
import uuid

if len(sys.argv) == 1:
    print "Usage: ./exportserver.py [pathtostochss]"
    exit(0)

db = os.path.abspath(sys.argv[1])

path = os.path.abspath(os.path.dirname(__file__))

try:
    os.mkdir(os.path.join(path, 'app2/static/tmp'))
except:
    pass

mac = False
# Let's search for mydatastore!
if not os.path.exists(os.path.join(db, 'mydatastore')):
    if not os.path.exists(os.path.join(db, 'Contents/Resources/mydatastore')):
        
        if os.path.exists(os.path.join(db, 'StochSSserver.app/Contents/Resources/mydatastore')):
            mac = True

            db = os.path.join(db, 'StochSSserver.app/Contents/Resources')
        else:
            print " Cannot find mydatastore in path {0}, {1}, or {2}".format(db, os.path.join(db, 'Contents/Resources/'), os.path.join(db, 'StochSSserver.app/Contents/Resources/'))
            print " Exiting..."
            exit(1)
    else:
        mac = True
        db = os.path.join(db, 'Contents/Resources')

# Let's do the same search for dev_appserver!
devAppServer = os.path.join(path, 'sdk/python/dev_appserver.py')
if not os.path.exists(devAppServer):
    if not os.path.exists(os.path.join(path, 'StochSSserver.app/Contents/Resources/sdk/python/dev_appserver.py')):
        
        if os.path.exists(os.path.join(path, 'StochSS/StochSSserver.app/Contents/Resources/sdk/python/dev_appserver.py')):
            devAppServer = os.path.join(path, 'StochSS/StochSSserver.app/Contents/Resources/sdk/python/dev_appserver.py')
        else:
            print " Cannot find dev_appserver.py in path '{0}, {1}, or {2}'".format(os.path.join(path, 'sdk/python/'),  os.path.join(path, 'StochSSserver.app/Contents/Resources/sdk/python/'), os.path.join(path, 'StochSS/StochSSserver.app/Contents/Resources/sdk/python/'))
            print " Exiting..."
            exit(1)
    else:
        devAppServer = os.path.join(path, 'StochSSserver.app/Contents/Resources/sdk/python/dev_appserver.py')

print "--- Running Export Server ---"

req = None
try:
    req = urllib2.urlopen("http://localhost:8080/")
except:
    pass

if req:
    if req.getcode() == 200:
        print "There seems to be another webserver already running on localhost:8080"
        
        exit(-1)

# Deploy the app on localhost
#print path

stdout = open('stdout.log', 'w')
stderr = open('stderr.log', 'w')

h = subprocess.Popen(("python {0} --host=localhost --datastore_path={1}/mydatastore --skip_sdk_update_check YES --datastore_consistency_policy=consistent app2".format(devAppServer, db)).split(), stdout = stdout, stderr = stderr)

print "Starting admin server at: http://localhost:8000"
sys.stdout.flush()

def clean_up_and_exit(signal, stack):
    print "Killing webserver proces..."
    sys.stdout.flush()

    try:
        h.terminate()
    except:
        pass

    if signal == None:
        exit(0)
    else:
        exit(-1)

signal.signal(signal.SIGHUP, clean_up_and_exit)
signal.signal(signal.SIGINT, clean_up_and_exit)
signal.signal(signal.SIGQUIT, clean_up_and_exit)
signal.signal(signal.SIGILL, clean_up_and_exit)
signal.signal(signal.SIGABRT, clean_up_and_exit)
signal.signal(signal.SIGFPE, clean_up_and_exit)

# Wait for server to launch
serverUp = False
for tryy in range(0, 20):
    try:
        req = urllib2.urlopen("http://localhost:8080/")
    # This was a hack in place to get around issue that arose from allowing
    #  users accessing the app from localhost to not have to login.
    # except urllib2.HTTPError as e:
    #     req = None
    #     if e.code == 302 and e.reason.endswith('Found'):
    #         serverUp = True
    #         break
    except Exception:
        req = None

    if req:
        if req.getcode() == 200:
            # This is a strange sleep, but if we get a response from 8080, we must wait to make sure h has time to crash if it is going to
            # If we just barrell through here, we could be accessing another server on 8080, and h could be in the process of crashing
            time.sleep(1)

            ret = h.poll()
            if not h.poll():
                serverUp = True
            else:

                print "There seems to be another webserver already running on localhost:8080"

                sys.stdout.flush()
                serverUp = False
            break;
        else:
            ret = h.poll()
        
        # Sometimes the server fails to start for weird reason, make sure it keeps trying to start
            if ret is not None:
                if ret != 0:
                    startserver()
                
    time.sleep(2)
    print "Checking if launched -- try " + str(tryy + 1) +" of 20"
    sys.stdout.flush()

###print serverUp

if serverUp:
    stochss_url = 'http://localhost:8080/'
    # Open web browser

    if mac:
        wbrowser = subprocess.Popen('open {0}'.format(stochss_url).split())
        wbrowser.communicate()
    else:
        webbrowser.open_new(stochss_url)

    print "Logging stdout to " + path + "/stdout.log\n" + " and stderr to " + path + "/stderr.log"
    sys.stdout.flush()

    try:
        print "Navigate to {0} to access StochSS".format(stochss_url)

        sys.stdout.flush()
        if not mac:
            print "Press Control+C to terminate StochSS server"
            sys.stdout.flush()

        while 1:
            time.sleep(1)
    except KeyboardInterrupt:
        pass

    clean_up_and_exit(None, None)
else:
    print "Webserver never launched, cleaning up processes and exiting. Check " + path + "/stderr.log"
    sys.stdout.flush()
    clean_up_and_exit(None, None)

