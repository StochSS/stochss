#!/usr/bin/env python

import pickle, sys, struct

import periodamplitude_pb2

if __name__ == '__main__':
    while 1:
        n = struct.unpack('Q', sys.stdin.read(8))[0]

        if n == 0:
            break

        inmsg = periodamplitude_pb2.Output.FromString(sys.stdin.read(n))

        print pickle.loads(inmsg.T)
        print pickle.loads(inmsg.A)
