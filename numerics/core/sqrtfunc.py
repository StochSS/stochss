#!/usr/bin/env python
import stochss.Serializer
import math, sys

#This is the new model for custom code
def sqrtfunc():
    # Build a serializer...
    serializer = stochss.Serializer.Serializer()

    for args in serializer.deserializeFromStream():
        #App code
        #print >> sys.stderr, args
        serializer.serializeToStream(map(lambda x: math.sqrt(x), args))
        #end App code
        
    serializer.closeOutputStream()

if __name__ == "__main__":
    sqrtfunc()
