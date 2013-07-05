#!/usr/bin/env python
import os
import StringIO
import subprocess
import sys
import time
import threading
import urllib2
import webbrowser

run_indefinite = False
if len(sys.argv) == 2:
    run_indefinite = True

path = os.path.abspath(os.path.dirname(__file__))

print "--- Running StochSS Server ---"

pwd = os.getcwd()
os.chdir(path)

h = subprocess.Popen(("python conf/stochss-env.py").split())
h.wait()

stdout = open('stdout.log', 'w')
stderr = open('stderr.log', 'w')

# Deploy the app on localhost
h = subprocess.Popen(("python sdk/python/dev_appserver.py --skip_sdk_update_check YES --datastore_consistency_policy=consistent app").split(), stdout = stdout, stderr = stderr)

print "Starting admin server at: http://localhost:8000"

# Wait for server to launch
serverUp = False
for tryy in range(0, 10):
    try:
        req = urllib2.urlopen("http://localhost:8080/")

        if req.getcode() == 200:
            time.sleep(1)

            if not h.poll():
                serverUp = True
            else:
                print "There seems to be another webserver already running on localhost:8080"
                serverUp = False
            break;
    except:
        pass

    time.sleep(1)
    print "Checking if launched -- try " + str(tryy + 1) +" of 10"

if serverUp:
    # Open web browser
    webbrowser.open_new('http://localhost:8080/')

    print "Logging stdout to " + path + "/stdout.log" + "and stderr to " + path + "/stderr.log"

    try:
        print "Navigate to localhost:8080 to access StochSS"
        if run_indefinite:
            while 1:
                time.sleep(10)
        else:
            print "Press enter key to terminate StochSS server"
            ch = sys.stdin.read(1)
    except KeyboardInterrupt:
        pass

    print "Killing webserver proces..."
else:
    print "Webserver never launched, cleaning up processes and exiting. Check " + path + "/stderr.log"

try:
    h.terminate()
except:
    pass

os.chdir(pwd)
