#!/usr/bin/env python
import os
import subprocess
import shlex
import json
import traceback
import sys


def run_job(exec_str, stdout_file):
        with open(stdout_file, 'w') as stdout_fh:
            try:
                p = subprocess.Popen(
                    shlex.split(exec_str),
                    stdout=stdout_fh,
                    stderr=stdout_fh,
                )
                pid = p.pid
                # create pid file
                pid_file = ".molns/pid"
                return_code_file = ".molns/return_value"
                with open(pid_file, 'w+') as fd:
                    fd.write(str(pid))
                # Wait on program execution...
                return_code = p.wait()
                print "Return code:", return_code
                if return_code_file is not None:
                    with open(return_code_file, 'w+') as fd:
                        fd.write(str(return_code))
            except Exception as e:
                stdout_fh.write('Error: {}'.format(str(e)))
                stdout_fh.write(traceback.format_exc())
                raise sys.exc_info()[1], None, sys.exc_info()[2]


if __name__ == "__main__":
    with open(".molns/cmd",'r') as fd:
        exec_str = fd.read()
    print "exec_str", exec_str
    run_job(exec_str, ".molns/stdout")
