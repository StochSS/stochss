#!/usr/bin/env python
import fileinput, tempfile, struct, sys, os, subprocess, pickle, numpy

from stochss.model import *
from stochss.stochkit import *
import Workspace.Serializer

if __name__ == '__main__':

    serializer = Workspace.Serializer.Serializer()

    #arg(model model, int r, double t, int i, bool no-stats, bool keep-trajectories, int seed, bool keep-histograms, int bins, string species, int processes, double threshold)
    for args in serializer.deserializeFromStream():
        if len(args) < 12:
            for i in range(0, 12 - len(args)):
                args.append(None)
                
        # Build temporary files
        outputdir = tempfile.mkdtemp()
        [mfd, modelfile] = tempfile.mkstemp()

        mfhandle = os.fdopen(mfd, 'w')

        document = StochMLDocument.fromModel(args[0])
        mfhandle.write(document.toString())
        mfhandle.close()
        
        process = subprocess.Popen(['rm', '-rf', outputdir], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        process.wait()

        ssaArgs = []

        ssaArgs.append('-m ' + modelfile)

        ssaArgs.append('-r ' + str(args[1]))
        ssaArgs.append('-t ' + str(args[2]))
        ssaArgs.append('-i ' + str(args[3]))
        if args[4] == True:
            ssaArgs.append('--no-stats')
        if args[5] == True:
            ssaArgs.append('--keep-trajectories ')
        if args[7] == True:
            ssaArgs.append('--keep-histograms ')
        if args[8] != None:
            ssaArgs.append('--bins ' + str(args[8]))
        if args[9] != None:
            ssaArgs.append('--species ' + args[9])
        #args.append('--label')
        ssaArgs.append('--out-dir ' + outputdir)
        ssaArgs.append('--force')
        if args[6] != None:
            ssaArgs.append('--seed ' + str(args[6]))
        if args[10] != None:
            ssaArgs.append('--processes ' + str(args[10]))
        if args[11] != None:
            ssaArgs.append('--threshold ' + str(args[11]))
        
        process = subprocess.Popen(' '.join(['ssa'] + ssaArgs), shell=True, stdout=subprocess.PIPE)
        process.wait()

        means = numpy.ndarray(0)
        variances = numpy.ndarray(0)

        # Collect all the output data
        if args[4] != True:
            files = os.listdir(outputdir + '/stats')
            
            means = numpy.loadtxt(outputdir + '/stats/means.txt')
            variances = numpy.loadtxt(outputdir + '/stats/variances.txt')
            
            # This annoys me a little, but even though we have the protobuffers serialization layer, we still have to do application specific serialization
            #    Maybe we just set up the problem badly? Suggestions here?
           
        trajectories = []
        if args[5] == True:
            files = os.listdir(outputdir + '/trajectories')
            
            for filename in files:
                if 'trajectory' in filename:
                    trajectories.append(numpy.loadtxt(outputdir + '/trajectories/' + filename))
                else:
                    sys.stderr.write('Couldn\'t identify file (' + filename + ') found in output folder')
                    sys.exit(-1)

        process = subprocess.Popen(['rm', '-rf', outputdir, modelfile], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        process.wait()
        
        serializer.serializeToStream([means, variances, trajectories])

    serializer.closeOutputStream()
