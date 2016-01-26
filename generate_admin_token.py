#! /usr/bin/python
import sys
import socket
import urllib, urllib2

host_ip = socket.gethostbyname(socket.gethostname())

def print_usage_and_exit():
    '''
    '''
    print "Error in command line arguments!"
    print "Expected Usage: ./generate_admin_token.py [secret_key]"

def main(key):
    '''
    '''
    uuidgen > app/handlers/admin_uuid.txt

if __name__ == "__main__":
    if len(sys.argv) == 2:
        main(sys.argv[1])
    else:
        print_usage_and_exit()
