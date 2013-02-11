#!/usr/bin/env python

import sys, struct, pickle

import numpy, stochkit_pb2

if __name__ == '__main__':
    
    while 1:
        n = struct.unpack('Q', sys.stdin.read(8))[0]

        if n == 0:
            break;

        outmsg = stochkit_pb2.Output.FromString(sys.stdin.read(n))

        trajectories = pickle.loads(outmsg.trajectories) if outmsg.trajectories else ""

        means = pickle.loads(outmsg.means) if outmsg.means else ""

        variances = pickle.loads(outmsg.variances) if outmsg.variances else ""

        #print trajectories
        print means
        print variances

