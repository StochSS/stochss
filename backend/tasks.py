import sys,os
sys.path.append(os.path.join(os.path.dirname(__file__), '../lib/celery'))
sys.path.append(os.path.join(os.path.dirname(__file__), '../lib/kombu'))
sys.path.append(os.path.join(os.path.dirname(__file__), '../'))
sys.path.append(os.path.join(os.path.dirname(__file__), '../lib/amqp'))
sys.path.append(os.path.join(os.path.dirname(__file__), '../lib/billiard'))
sys.path.append(os.path.join(os.path.dirname(__file__), '../lib/anyjson'))
sys.path.append(os.path.join(os.path.dirname(__file__), '../lib/pytz'))
print str(sys.path)
#from distutils.sysconfig import get_python_lib
#print "***************"
#print(get_python_lib())
#print "***************"
from celery import Celery
import os
import uuid,traceback
print "inside tasks.py file"
celery = Celery('tasks',CELERY_RESULT_BACKEND='amqp', BROKER_URL='sqs://')
celery.config_from_object('celeryconfig')
import logging, subprocess

@celery.task(name='stochss')
def task(taskid,params):
  try:
        print 'task to be executed at remote location'
        print 'inside celery task method'
        res = {}
        filename = "{0}.xml".format(taskid)
        f = open(filename,'w')
        f.write(params['document'])
        f.close()
        xmlfilepath = filename
        paramstr =  params['paramstring']
        uuidstr = taskid
        res['uuid'] = uuidstr
        create_dir_str = "mkdir -p output/%s " % uuidstr
        os.system(create_dir_str)
        # check if the env variable is set form STOCHKIT_HOME or else use the default location
        #STOCHKIT_DIR = "/Users/RaceLab/StochKit2.0.6"
        STOCHKIT_DIR = "/home/ubuntu/StochKit2.0.6/"
        # AH: THIS DOES NOT WORK, FOR SOME REASON THE VARIABLE IS NOT PICKED UP FROM THE SHELL
        try:
            STOCHKIT_DIR = os.environ['STOCHKIT_HOME']
        except Exception:
            #ignores if the env variable is not set
            print "VARIABLE NOT SET!!"
            pass

        # The following executiong string is of the form : stochkit_exec_str = "~/StochKit2.0.6/ssa -m ~/output/%s/dimer_decay.xml -t 20 -i 10 -r 1000" % (uuidstr)
        stochkit_exec_str = "{0}/{2} -m {1} --out-dir output/{3}/result ".format(STOCHKIT_DIR,xmlfilepath,paramstr,uuidstr)
        #logging.debug("Spawning StochKit Task. String : ", stochkit_exec_str)
        print "======================="
        print " Command to be executed : "
        print stochkit_exec_str
        print "======================="
        print "To test if the command string was correct. Copy the above line and execute in terminal."
        p = subprocess.Popen(stochkit_exec_str, shell=True, stdin=subprocess.PIPE,stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        pid = p.pid;
        res['pid'] = taskid
        filepath = "output/%s//" % (uuidstr)
        absolute_file_path = os.path.abspath(filepath)
        
        #res['relative_output_path']=os.path.relpath(filepath,)

        #copies the XML file to the output direcory
        copy_file_str = "cp  {0} output/{1}".format(xmlfilepath,uuidstr)
        print copy_file_str
        os.system(copy_file_str)
        print 'generating tar file'
        create_tar_output_str = "tar -zcvf ~/output/{0}.tar ~/output/{0}".format(uuidstr)
        print create_tar_output_str
        logging.debug("followig cmd to be executed %s" % (create_tar_output_str))
        copy_to_s3_str = "python ~/sccpy.py output/%s.tar" % (uuidstr)
        os.system(create_tar_output_str)
        print 'copying file to s3 : ' + copy_to_s3_str
        os.system(copy_to_s3_str)
        print 'removing xml file'
        removefilestr = "rm {0}".format(xmlfilepath)
        os.system(removefilestr)
        res['output'] = "https://s3.amazonaws.com/stochkitoutput/output/{0}.tar".format(taskid)
  except Exception,e:
        print str(e)
        return None 
  return res


def checkStatus(task_id):
    '''
    Method takes task_id as input and returns the result of the celery task
    '''
    result = {}
    try:
        from celery.result import AsyncResult
        res = AsyncResult(task_id)
        result = res.result
        result['state'] = res.status
        if res.status == "PROGRESS":
            print 'Task in progress'
            print 'Current %d' % result['current']
            print 'Total %d' % result['total']
            result['result'] = None
        elif res.status == "SUCCESS":
            result['result'] = res.result
        elif res.status == "FAILURE":
            result['result'] = res.result 
    except Exception, e:
        result['state'] = "FAILURE"
        result['result'] = str(e)
    return result


def removeTask(task_id):
    '''
    this method revokes scheduled tasks as well as the tasks in progress
    '''
    try:
        from celery.task.control import revoke
        revoke(task_id,terminate=True)
    except Exception,e:
        print "task cannot be removed/deleted. Error : ".format(str(e))