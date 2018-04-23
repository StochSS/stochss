import os
import sys
import time
import logging
from collections import OrderedDict
import collections
import installSoftware
from molns_provider import ProviderBase, ProviderException
from OpenStackProvider import OpenStackProvider, OpenStackController, OpenStackWorkerGroup
import pyrax


##########################################
class RackspaceProvider(OpenStackProvider):
    """ Provider handle for an open stack service. """


    PROVIDER_TYPE = 'Rackspace'
    OBJ_NAME = 'RackspaceProvider'
    
    
    CONFIG_VARS = OrderedDict(
    [
    ('rackspace_username',
        {'q':'Rackspace username', 'default':os.environ.get('OS_USERNAME'), 'ask':True}),
    ('rackspace_password',
        {'q':'Rackspace password', 'default':os.environ.get('OS_PASSWORD'), 'ask':True, 'obfuscate':True}),
    ('rackspace_project_id',
        {'q':'Rackspace tenant_id', 'default':os.environ.get('OS_TENANT_NAME'), 'ask':True}),
    ('rackspace_region',
        {'q':'Rackspace region (leave empty for default)', 'default':None, 'ask':True}),
    #('nova_version',
    #    {'q':'Enter the version of the OpenStack NOVA API', 'default':"2", 'ask':True}),
    ('key_name',
        {'q':'Rackspace Key Pair name', 'default':None, 'ask':True}),
    ('group_name',
        {'q':'Rackspace Security Group name', 'default':'molns', 'ask':True}),
    ('ubuntu_image_name',
        {'q':'ID of the base Ubuntu image to use', 'default':None, 'ask':True}),
    ('molns_image_name',
        {'q':'ID of the MOLNs image (leave empty for none)', 'default':None, 'ask':True}),
    ('default_instance_type',
        {'q':'Default Instance Type (Flavor)', 'default':'standard.xsmall', 'ask':True}),
    ('login_username',
        {'default':'ubuntu', 'ask':False})
    ])
    
    
    def _connect(self):
        if self.connected: return
        pyrax.set_credentials(
            username=self.config['rackspace_username'],
            api_key=self.config['rackspace_password'],
            tenant_id=self.config['rackspace_project_id'],
            region=self.config['rackspace_region'])
        self.nova = pyrax.cloudservers
        self.connected = True

##########################################
class RackspaceController(OpenStackController):
    """ Provider handle for an open stack controller. """
    
    PROVIDER_TYPE = 'Rackspace'
    OBJ_NAME = 'RackspaceController'

    CONFIG_VARS = OrderedDict(
    [
    ('instance_type',
        {'q':'Default Instance Type (Flavor)', 'default':'standard.xsmall', 'ask':True}),
    ])

##########################################
class RackspaceWorkerGroup(OpenStackWorkerGroup):
    """ Provider handle for an open stack controller. """
    
    OBJ_NAME = 'RackspaceWorkerGroup'

    CONFIG_VARS = OrderedDict(
    [
    ('instance_type',
        {'q':'Default Instance Type (Flavor)', 'default':'standard.xsmall', 'ask':True}),
    ('num_vms',
        {'q':'Number of virtual machines in group', 'default':'1', 'ask':True}),
    ])

