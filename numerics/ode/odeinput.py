#!/usr/bin/env python

import sys, struct

import ode_pb2, google.protobuf.message

if __name__ == '__main__':
    inmsg = ode_pb2.Input()

    fhandle = open('../vilar.xml', 'r')

    inmsg.model = fhandle.read()
    inmsg.t = 400
    inmsg.i = 5

    fhandle.close()
    
    inmsgs = inmsg.SerializeToString()
    
    sys.stdout.write(struct.pack('Q', len(inmsgs)))
    
    sys.stdout.write(inmsgs)

    sys.stdout.write(struct.pack('Q', 0))
