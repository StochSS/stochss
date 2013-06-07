#!/env/python
""" 
Write the App's (optional) configuration file. This script
gets executed when launching the app via the utility script
'launchapp', but not if you launch directly with dev_appserver.py

author: andreash    
"""
import os
import subprocess

STOCHKIT_HOME=''
AWS_ACCESS_KEY_ID=''
AWS_SECRET_ACCESS_KEY=''

#### There is no need to modify anything below this line, unless you have added new variables above

# If a variable is not set, try to set it from system environment variables
if STOCHKIT_HOME=='':
   try:
      STOCHKIT_HOME=os.environ['STOCHKIT_HOME']
   except:
      pass	

if AWS_ACCESS_KEY_ID=='':
   try:
   	AWS_ACCESS_KEY_ID=os.environ['AWS_ACCESS_KEY_ID']
   except:
        pass

if AWS_SECRET_ACCESS_KEY=='':
   try:
	AWS_SECRET_ACCESS_KEY=os.environ['AWS_SECRET_ACCESS_KEY']
   except:
 	pass

try:
    config_file=os.path.join(os.path.dirname(__file__),'../app/conf/app_config.py')
    fh = open(config_file,'w')
    
    fh.write('app_config={}'+os.linesep)
             
    if STOCHKIT_HOME is not '':
        fh.write("app_config['STOCHKIT_HOME']="+"'"+STOCHKIT_HOME+"'"+os.linesep)
    if AWS_ACCESS_KEY_ID is not '':
        fh.write("app_config['AWS_ACCESS_KEY']="+"'"+AWS_ACCESS_KEY_ID+"'"+os.linesep)
    if AWS_SECRET_ACCESS_KEY is not '':
        fh.write("app_config['AWS_SECRET_KEY']="+"'"+AWS_SECRET_ACCESS_KEY+"'"+os.linesep)
    
    fh.close()
except:
    print "Warning, failed to write configuration file."
    raise	
    pass

