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
import socket

open_browser = sys.argv[2]
mac = False
if 'mac' in sys.argv:
    mac = True

try:
    admin_token = sys.argv[3]
except IndexError:
    print("Admin token not received. Will generate one.")

try:
    host_ip = sys.argv[4]
    if host_ip == "0":
        host_ip = "localhost"
except IndexError:
    host_ip = "localhost"

path = os.path.abspath(os.path.dirname(__file__))

try:
    os.mkdir('{0}/app/output'.format(path))
except:
    pass

try:
    os.mkdir('{0}/app/static/tmp'.format(path))
except:
    pass

if mac:
    print "<h2>Running StochSS Server</h2><br />"
else:
    print "--- Running StochSS Server ---"

req = None
try:
    req = urllib2.urlopen("http://{0}:8080/".format(host_ip))
except:
    pass

if req:
    if req.getcode() == 200:
        if mac:
            print "<font color=red>"

        print "There seems to be another webserver already running on {0}:8080".format(host_ip)

        if mac:
            print "</font><br />"

        exit(-1)

h = subprocess.Popen(("python " + path + "/conf/stochss-env.py").split(), stdout=subprocess.PIPE,
                     stderr=subprocess.PIPE)
h.communicate()

proc = {}

stdout = open('stdout.log', 'w')
stderr = open('stderr.log', 'w')

# Deploy the app on host_ip
# print path
def startserver():
    import sys
    print "#"*80
    print "#"*80
    print sys.argv
    print "#"*80
    print "#"*80
    if '--debug' in sys.argv:
        print "Debug = Yes"
    if 'debug' in sys.argv:
        return subprocess.Popen((
                         "python " + path + "/sdk/python/dev_appserver.py --host={1} --datastore_path={0}/mydatastore --skip_sdk_update_check YES --datastore_consistency_policy=consistent --log_level=debug app".format(path, host_ip)).split(), stdout=stdout, stderr=stderr)
    else:
        return subprocess.Popen((
                         "python " + path + "/sdk/python/dev_appserver.py --host={1} --datastore_path={0}/mydatastore --skip_sdk_update_check YES --datastore_consistency_policy=consistent app".format(
                             path, host_ip)).split(), stdout=stdout, stderr=stderr)

def startjupyternotebook():
     return subprocess.Popen((
        "jupyter notebook --NotebookApp.open_browser=False --ip={1} --port=9999 --config={0}/jupyter_profile/jupyter.config".format(path, host_ip)).split(),         
        stdout=stdout, stderr=stderr, preexec_fn=os.setsid)

def clean_up_and_exit(in_signal, stack):
    print "Killing webserver process..."
    if mac:
        print "<br />"
    sys.stdout.flush()

    try:
        proc['server'].terminate()
    except:
        pass

    try:
        print "Killing jupyter notebook process [pid={0}]...".format(proc['jupyternotebook'].pid)
        if mac:
            print "<br /></body></html>"
        sys.stdout.flush()
        pgrp = os.getpgid(proc['jupyternotebook'].pid)
        os.killpg(pgrp, signal.SIGINT)
        time.sleep(0.1)
        os.killpg(pgrp, signal.SIGTERM)
    except Exception as e:
        print "Failed to kill notebook: {0}".format(e)
       

    if signal == None:
        exit(0)
    else:
        exit(-1)


#print "Starting admin server at: http://{0}:8000".format(host_ip)
print "Starting server at: http://{0}:8080".format(host_ip)
if mac:
    print "<br />"
try:
    proc['server'] = startserver()
except Exception as e:
    print "Error starting server: {0}".format(e)
    sys.exit(1)
sys.stdout.flush()

print "Starting jupyter notebook server at: http://{0}:9999".format(host_ip)
if mac:
    print "<br />"
try:
    proc['jupyternotebook'] = startjupyternotebook()
except Exception as e:
    print "Error startring jupyter notebook: {0}".format(e)
sys.stdout.flush()

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
        req = urllib2.urlopen("http://{0}:8080/login".format(host_ip))
    # This was a hack in place to get around issue that arose from allowing
    #  users accessing the app from host_ip to not have to login.
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
            if h.poll() == 0:
                serverUp = True
            else:
                if mac:
                    print "<font color=red>"

                print "There seems to be another webserver already running on {0}:8080".format(host_ip)

                if mac:
                    print "</font><br />"

                sys.stdout.flush()
                serverUp = False
            break
        else:
            ret = h.poll()

            # Sometimes the server fails to start for weird reason, make sure it keeps trying to start
            if ret is not None:
                if ret != 0:
                    startserver()

    time.sleep(2)
    print "Checking if launched -- try " + str(tryy + 1) + " of 20"
    if mac:
        print "<br />"
    sys.stdout.flush()

###print serverUp

if serverUp:
    # Set up admin token
    if admin_token == "not_set":
        admin_token = uuid.uuid4()
        generate_admin_token_command = './generate_admin_token.py {0}'.format(admin_token)
        os.system(generate_admin_token_command)
    else:
        try:
            with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'app/handlers/admin_uuid.txt'), 'w') as file:
                file.write(str(admin_token))
        except Exception as e:
            print " File write error: cannot create admin token {0}".format(str(e))

    stochss_url = 'http://{1}:8080/login?secret_key={0}'.format(admin_token, host_ip)
    # Open web browserterminal

    if mac and open_browser == "true":
        wbrowser = subprocess.Popen('open {0}'.format(stochss_url).split())
        wbrowser.communicate()
    elif open_browser == "true":
        webbrowser.open_new(stochss_url)

    if mac:
        print " Stdout available at {0}/stdout.log and <br />".format(path)
        print " Stderr available at {0}/stderr.log<br />".format(path)
        print "<br />"
    else:
        print "Logging stdout to " + path + "/stdout.log\n" + " and stderr to " + path + "/stderr.log"
    sys.stdout.flush()

    try:
        print "Navigate to http://{1}:8080/login?secret_key={0} to access StochSS".format(admin_token, host_ip)
        if mac:
            print "<br />"

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
    if mac:
        print "<font color=red>"
    print "Webserver never launched, cleaning up processes and exiting. Check " + path + "/stderr.log"
    if mac:
        print "<br />"
    sys.stdout.flush()
    clean_up_and_exit(None, None)
