#!/usr/bin/env python
""" 
    
Write the App's (optional) configuration file. This script
gets executed when launching the app via the utility script
'launchapp', but not if you launch directly with dev_appserver.py

author: andreash   
    
"""
import os
import sys

path = os.path.abspath(os.path.dirname(__file__))

# STOCHKIT_HOME and STOCHKIT_ODE should be written in a newline separated file 'conf/config'
# /path/to/Stochkit
# /path/to/ode
# Try to read the configuration file
config = []
try:
    ffile = open('{0}/config'.format(path))
    config = ffile.read().split()
    ffile.close()
except:
    pass

if len(config) == 0:
   STOCHKIT_HOME=''
else:
   STOCHKIT_HOME = config[0]

if len(config) == 1:
   STOCHKIT_ODE=''
else:
   STOCHKIT_ODE = config[1]

if len(config) == 2:
   STOCHOPTIM=''
else:
   STOCHOPTIM = config[2]

# If a configuration variable is not set, try to set it from system environment variables
if STOCHKIT_HOME=='':
   try:
      STOCHKIT_HOME=os.environ['STOCHKIT_HOME']
   except:
      pass

if STOCHKIT_ODE=='':
   try:
      STOCHKIT_ODE=os.environ['STOCHKIT_ODE']
   except:
      pass

if STOCHOPTIM=='':
   try:
      STOCHOPTIM=os.environ['STOCHOPTIM']
   except:
      pass

try:
    config_file=os.path.join(os.path.dirname(__file__),'../app/conf/app_config.py')
    fh = open(config_file,'w')
    
    fh.write('app_config={}'+os.linesep)
             
    if STOCHKIT_HOME is not '':
        fh.write("app_config['STOCHKIT_HOME']="+"'"+STOCHKIT_HOME+"'"+os.linesep)
    if STOCHKIT_ODE is not '':
        fh.write("app_config['STOCHKIT_ODE']="+"'"+STOCHKIT_ODE+"'"+os.linesep)
    if STOCHOPTIM is not '':
        fh.write("app_config['STOCHOPTIM']="+"'"+STOCHOPTIM+"'"+os.linesep)
    
    fh.close()
except:
    print "Warning, failed to write configuration file."
    raise	
    pass

