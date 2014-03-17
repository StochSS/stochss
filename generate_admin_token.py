#! /usr/bin/python
import sys
import urllib, urllib2

def print_usage_and_exit():
    '''
    '''
    print "Error in command line arguments!"
    print "Expected Usage: ./generate_admin_token.py [secret_key]"

def main(key):
    '''
    '''
    url = 'http://localhost:8080/secret_key'
    values = { 'key_string': key }
    data = urllib.urlencode(values)
    request = urllib2.Request(url, data)
    response = urllib2.urlopen(request)

if __name__ == "__main__":
    if len(sys.argv) == 2:
        main(sys.argv[1])
    else:
        print_usage_and_exit()