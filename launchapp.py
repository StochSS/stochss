#!/usr/bin/env python
import os
import StringIO
import subprocess
import sys
import time
import threading
import urllib2
import webbrowser

# Execute the configuration script
h = subprocess.Popen("python conf/stochss-env.py".split())
h.wait()

path = os.path.abspath(os.path.dirname(__file__))

stdout = open('stdout.log', 'w')
stderr = open('stderr.log', 'w')

# Deploy the app on localhost
h = subprocess.Popen("python sdk/python/dev_appserver.py --skip_sdk_update_check YES --datastore_consistency_policy=consistent app".split(), stdout = stdout, stderr = stderr)

print "Starting server at: http://localhost:8080"
print "Starting admin server at: http://localhost:8000"

# Wait for server to launch. We try 10 times at intervals of 1 second. 
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
    print "Checking if server is ready -- try " + str(tryy + 1) +" of 10"

if serverUp:
    print "Server started sucessfully."
    # Open web browser
    webbrowser.open('http://localhost:8080/')

    print "Logging stdout to " + path + "/stdout.log" + "and stderr to " + path + "/stderr.log"

    try:
        print "Press enter key to end StochSS session"
        ch = sys.stdin.read(1)
    except KeyboardInterrupt:
        pass

    print "Killing webserver process..."
else:
    print "Webserver failed to launch, cleaning up processes and exiting. Check " + path + "/stderr.log"

try:
    h.terminate()
except:
    pass
