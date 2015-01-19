'''
Created on Nov 19, 2014

@author: gumengyuan
'''

from google.appengine.ext import db
import logging

# class Price(db.Model):
#     
#     '''
#     classdocs
#     '''
#     agent = db.StringProperty()
#     region = db.StringProperty()
#     instance_type = db.StringProperty()
#     price_hour = db.FloatProperty()

class Price:
    COST_TABLE_PER_HOUR = {
             "ec2": {
                     "t1.micro": 0.013,
                     "m1.small": 0.026,
                     "m3.medium": 0.070,
                     "m3.large": 0.140,
                     "c3.large": 0.105,
                     "c3.xlarge": 0.210
                     }
             }
    
    
    
# def initialize_price_model():
#     # start to initialize Price model
#     if Price.all().count() != 0:
#         logging.info('No need to initialize Price model.')
#     else:
#         logging.info('Initializing Price model...')
#         agent = "ec2"
#         region = "US East"
#         price = Price(agent=agent, region = region, instance_type="t1.micro", price_hour=0.013)
#         price.put()
#         price = Price(agent=agent, region = region, instance_type="m1.small", price_hour=0.026)
#         price.put()
#         price = Price(agent=agent, region = region, instance_type="m3.medium", price_hour=0.07)
#         price.put()
#         price = Price(agent=agent, region = region, instance_type="m3.large", price_hour=0.140)
#         price.put()
#         price = Price(agent=agent, region = region, instance_type="c3.large", price_hour=0.105)
#         price.put()
#         price = Price(agent=agent, region = region, instance_type="c3.large", price_hour=0.210)
#         price.put()
#     
    
        