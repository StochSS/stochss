#! /usr/bin/python
import sys
import urllib, urllib2
import os

def print_usage_and_exit():
    '''
    '''
    print "Error in command line arguments!"
    print "Expected Usage: ./generate_admin_token.py [secret_key]"

def main(key):
    '''
    '''
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
