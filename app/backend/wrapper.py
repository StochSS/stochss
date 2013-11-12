#!/usr/bin/env python

import signal
import subprocess
import sys

f_stdo = open(sys.argv[1], 'w')
f_stde = open(sys.argv[2], 'w')

h = subprocess.Popen(sys.argv[3:], stdout = f_stdo, stderr = f_stde)

def clean_up_and_exit(s, st):
    h.terminate()
    exit(0)

signal.signal(signal.SIGHUP, clean_up_and_exit)
signal.signal(signal.SIGINT, clean_up_and_exit)
signal.signal(signal.SIGQUIT, clean_up_and_exit)
signal.signal(signal.SIGILL, clean_up_and_exit)
signal.signal(signal.SIGABRT, clean_up_and_exit)
signal.signal(signal.SIGFPE, clean_up_and_exit)

h.wait()

f_stdo.close()
f_stde.close()
