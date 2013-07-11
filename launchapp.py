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

source_exec = sys.argv[1]

mac = False
if len(sys.argv) == 3:
    mac = True

path = os.path.abspath(os.path.dirname(__file__))

print "--- Running StochSS Server ---"

h = subprocess.Popen(("python " + path + "/conf/stochss-env.py").split())
h.wait()

stdout = open('stdout.log', 'w')
stderr = open('stderr.log', 'w')

# Deploy the app on localhost
print path

def startserver():
    h = subprocess.Popen(("python " + path + "/sdk/python/dev_appserver.py --skip_sdk_update_check YES --datastore_consistency_policy=consistent app").split(), stdout = stdout, stderr = stderr)

startserver()

print "Starting admin server at: http://localhost:8000"
sys.stdout.flush()

# Wait for server to launch
serverUp = False
for tryy in range(0, 50):
    try:
        req = urllib2.urlopen("http://localhost:8080/")

        if req.getcode() == 200:
            # This is a strange sleep, but if we get a response from 8080, we must wait to make sure h has time to crash if it is going to
            # If we just barrell through here, we could be accessing another server on 8080, and h could be in the process of crashing
            time.sleep(1)

            ret = h.poll()
            if h.poll() == 0:
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
    except:
        pass
                
    time.sleep(1)
    print "Checking if launched -- try " + str(tryy + 1) +" of 10"
    sys.stdout.flush()

def clean_up_and_exit(signal, stack):
    print "Killing webserver proces..."
    sys.stdout.flush()

    try:
        h.terminate()
    except:
        pass

    if os.path.isfile('update'):
        sys.stdout.write('Updating application now...')
        sys.stdout.flush()

        h = subprocess.Popen('git stash'.split())
        if h.returncode != 0:
            os.remove('update')
            print "Error in updating, exiting"
            sys.stdout.flush()
            exit(-1)

        h = subprocess.Popen('git pull'.split())
        if h.returncode != 0:
            os.remove('update')
            print "Error in updating, exiting"
            sys.stdout.flush()
            exit(-1)

        #print "Success"
        print "Done updating, relaunching {0}...".format(source_exec)
        sys.stdout.flush()
        os.remove('update')

        sys.stderr.flush()
        sys.stdout.flush()

        os.execl(source_exec, source_exec)

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

if serverUp:
    # Open web browser
    webbrowser.open_new('http://localhost:8080/')

    print "Logging stdout to " + path + "/stdout.log\n" + " and stderr to " + path + "/stderr.log"
    sys.stdout.flush()

    try:
        print "Navigate to http://localhost:8080 to access StochSS"
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
