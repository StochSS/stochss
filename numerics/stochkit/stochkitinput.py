#!/usr/bin/env python

import sys, struct

import stochkit_pb2, google.protobuf.message

if __name__ == '__main__':
    inmsg = stochkit_pb2.Input()

    fhandle = open('dimer_decay.xml', 'r')

    inmsg.model = fhandle.read()
    inmsg.r = 1000
    inmsg.t = 10
    inmsg.i = 10
    inmsg.keep_trajectories = True

    fhandle.close()
    
    inmsgs = inmsg.SerializeToString()
    
    sys.stdout.write(struct.pack('Q', len(inmsgs)))
    
    sys.stdout.write(inmsgs)

    sys.stdout.write(struct.pack('Q', 0))
