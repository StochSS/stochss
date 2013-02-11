#!/usr/bin/env python

import fileinput, tempfile, struct, sys, os, subprocess, pickle
import numpy, ode_pb2

# For the MIMO model, we need to have a while
while 1:
    
    # Read in the bytes
    try:
        n = struct.unpack('Q', sys.stdin.read(8))[0]
    except Exception as e:
        sys.stderr.write('Could not read in number of bytes of input (int64, 8 bytes)')
        sys.exit(-1)

    # If n == 0, we've read the tail
    if n == 0:
        break;

    # Read in the actual data
    try:
        data = sys.stdin.read(n)
    except Exception as e:
        sys.stderr.write('Could not read in data lump')
        sys.exit(-1)

    # Deserialize to the Protobuffer format
    try:
        inmsg = ode_pb2.Input.FromString(data)
    except Exception as e:
        sys.stderr.write('Failed to convert intput data to protocol buffers object')
        sys.exit(-1)
    args = []

    # Build temporary files
    outputdir = tempfile.mkdtemp()
    outmsg = ode_pb2.Output()
    [mfd, modelfile] = tempfile.mkstemp()

    mfhandle = os.fdopen(mfd, 'w')
    mfhandle.write(str(inmsg.model))
    mfhandle.close()
    
    process = subprocess.Popen(['rm', '-rf', outputdir], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    process.wait()

    args.append('-m ' + modelfile)

    args.append('-t ' + str(inmsg.t))
    args.append('-i ' + str(inmsg.i))
    if inmsg.species != '':
        args.append('--species ' + str(inmsg.species))
    #args.append('--label')
    args.append('--out-dir ' + outputdir)
    args.append('--force')
    
    process = subprocess.Popen(' '.join(['`which stochkit_ode`'] + args), shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    #print >> sys.stderr, ' '.join(['`which stochkit_ode`'] + args)
    process.wait()
    
    # Collect all the output data
    values = numpy.loadtxt(outputdir + '/output.txt')

    outmsg.values = pickle.dumps([ values ])
        
    #process = subprocess.Popen(['rm', '-rf', outputdir, modelfile], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    process.wait()
    
    outmsgs = outmsg.SerializeToString()

    # Dump the output to stdout
    sys.stdout.write(struct.pack('Q', len(outmsgs)))
    sys.stdout.write(outmsgs)

sys.stdout.write(struct.pack('Q', 0))
