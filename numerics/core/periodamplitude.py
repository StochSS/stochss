#!/usr/bin/env python

""" 
    
    Simple postprocessing (map) routine for StochKit2.
    
    Tries to estimate the period and amplitued of a timeseries
    that oscillates. 
    
    input:  (StochKitTrajectory) A StochKit2 trajectory output file. 
    output: (ndarray) (2 x 1) array with the [period amplitude]
    
    descibed in: periodamplitude.yaml
    
"""

import sys, pickle, struct
import numpy, StringIO
import math

import stochss.Serializer

serializer = stochss.Serializer.Serializer()

#arg(int r, double t, int i, bool no-stats, bool keep-trajectories, bool keep-histograms, int bins, string species, int seed, int processes, double threshold)
for args in serializer.deserializeFromStream():
    if len(args) < 1:
        for i in range(0, 1 - len(args)):
            args.append(None)

    trajectories = args[0]

    # This allocation is a bit presumptuous, but forgive me...
    Tp = numpy.zeros(numpy.shape(trajectories[0])[1] - 1)
    As = numpy.zeros(numpy.shape(trajectories[0])[1] - 1)

    # This little bit of code does:
    #    Measure frequency and amplitude of each trajectory
    #    Return only the mean and amplitude of those
    #
    # It seems like we could write this as more map reduce stuff?
    #    Would something like this be reasonable to support? Workers spawning more work?
    #    Perhaps in some sort of searching algorithm, mappers would find a launch more work
    #    And load balancing would still work even if things were imbalanced.
    for trajectory in trajectories:
        
        dims = numpy.shape(trajectory)
        tlen = dims[0]
        Mspecies = dims[1]

        # Regard the first 10% of the trajectory as a startup period.
        
        offset = math.floor(0.1*tlen)
        ttlen = len(trajectory[offset:tlen,0]);
        T = trajectory[tlen-1, 0]-trajectory[offset,0];

        
        
        # We will look for oscillations in all species
        for specie in range(1, Mspecies):
            meana = numpy.mean(trajectory[offset:tlen, specie])
            A  = trajectory[offset:tlen, specie]-meana
            ffta = numpy.fft.fft(A);
            power = numpy.abs(ffta[0:math.floor(len(ffta-1)/2)])/(ttlen/2)
            freq =  range(0,len(power)-1)/T
            indmax = numpy.argmax(power[1:len(power)])

            f = freq[indmax]
            amp = power[indmax]

            Tp[specie - 1] = Tp[specie - 1] + f
            As[specie - 1] = As[specie - 1] + 1.0 * amp

    Tp = Tp / len(trajectories)
    As = As / len(trajectories)

    serializer.serializeToStream([Tp, As])
    
serializer.closeOutputStream()
