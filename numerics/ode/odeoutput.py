#!/usr/bin/env python

import sys, struct, pickle

import numpy, ode_pb2

if __name__ == '__main__':
    
    while 1:
        n = struct.unpack('Q', sys.stdin.read(8))[0]

        if n == 0:
            break;

        outmsg = ode_pb2.Output.FromString(sys.stdin.read(n))

        values = pickle.loads(outmsg.values) if outmsg.values else ""

        print values
