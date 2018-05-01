'''
Created on Nov 19, 2014

@author: gumengyuan
'''

from google.appengine.ext import db
import logging


class Price:
    COST_TABLE_PER_HOUR = {
        "ec2": {
            "t1.micro": 0.013,
            "m1.small": 0.044,
            "m3.medium": 0.067,
            "m3.large": 0.133,
            "c3.large": 0.105,
            "c3.xlarge": 0.21
        }
    }
