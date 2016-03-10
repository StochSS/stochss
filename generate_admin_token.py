#! /usr/bin/python
import sys
import urllib, urllib2
import time
import os

def print_usage_and_exit():
    '''
    '''
    print "Error in command line arguments!"
    print "Expected Usage: ./generate_admin_token.py [secret_key]"

def main(key):
    '''
    '''
 #   url = 'http://localhost:8080/secret_key'
 #   values = { 'key_string': key }
 #   data = urllib.urlencode(values)
 #   cnt=0;cnt_max=120
 #   while cnt<cnt_max:
 #       cnt+=1
 #       try:
 #           request = urllib2.Request(url, data)
 #           response = urllib2.urlopen(request)
 #           r = response.read()
 #           if 'Successful secret key creation!' not in  r:
 #               print response.code()
 #               print response.info()
 #               print r
 #               raise Exception('try again')
 #           break
 #       except Exception as e:
 #           print e
 #           sys.stdout.flush()
 #           time.sleep(1)
 #   if cnt >= cnt_max:
 #      raise Exception('Could not set admin token.')

    try:
        with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'app/handlers/admin_uuid.txt'), 'w') as file:
            file.write(str(key))
    except Exception as e:
        print " File write error: cannot create admin token {0}".format(str(e))

if __name__ == "__main__":
    if len(sys.argv) == 2:
        main(sys.argv[1])
    else:
        print_usage_and_exit()
