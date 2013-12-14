#! /usr/bin/python
import sys
import run_ec2

def print_usage_and_exit():
    print "Error in command line arguments!"
    print "Expected Usage: ./run.windows.py [command]"
    print "Accepted Commands:"
    print "- start"
    print "- stop"
    print "- list"
    exit(-1)

if __name__ == "__main__":
    if len(sys.argv) == 2:
        command = sys.argv[1]
        if command == "start":
            run_ec2.main("start", is_windows=True)
        elif command == "stop":
            while 1:
                should_not_terminate = raw_input("Do you want to save the data associated with this StochSS application (y/n)? ").lower()
                if should_not_terminate == "y":
                    run_ec2.main("stop", is_windows=True)
                elif should_not_terminate == "n":
                    run_ec2.main("terminate", is_windows=True)
                else:
                    print "Unrecognized response: {0}.".format(should_not_terminate)
                    continue
        elif command == "list":
            run_ec2.main("list", is_windows=True)
        else:
            print_usage_and_exit()
    else:
        print_usage_and_exit()