#! /usr/bin/python
import os, sys

def print_usage_and_exit():
    '''
    '''
    print "Error in command line arguments!"
    print "Expected Usage: ./exchange_admin_token.py [/path/to/ssh_key] [username] [ip] [admin_token]"

def main(ssh_key, username, ip, admin_token):
    create_admin_key_string = "ssh -o 'StrictHostKeyChecking no' -i {0} {1}@{2} 'python ~/stochss/generate_admin_token.py {3} > temp_output.log'".format(ssh_key, username, ip, admin_token)
    success = os.system(create_admin_key_string)
    if success != 0:
        exit(-1)
    print "Exchange complete."

if __name__ == "__main__":
    if len(sys.argv) == 5:
        main(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
    else:
        print_usage_and_exit()
