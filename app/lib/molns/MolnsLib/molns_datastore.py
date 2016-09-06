#!/usr/bin/env python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()
from sqlalchemy import Column, Integer, String, Sequence
from sqlalchemy.orm import sessionmaker
import os
import logging
import sys
import uuid
import datetime
#############################################################
#VALID_PROVIDER_TYPES = ['OpenStack', 'EC2', 'Rackspace']
VALID_PROVIDER_TYPES = ['OpenStack', 'EC2', 'Eucalyptus']
#############################################################
#### SCHEMA #################################################
#############################################################

class Provider(Base):
    """ DB object for an infrastructure service provider. """
    __tablename__ = 'providers'
    id = Column(Integer, Sequence('provider_id_seq'), primary_key=True)
    type = Column(String) #'EC2', 'Azure', 'OpenStack'
    name = Column(String)

    def __str__(self):
        return "Provider({0}): name={1} type={2}".format(self.id, self.name, self.type)

class ProviderData(Base):
    """ DB object to store the key/value pairs for a service provider. """
    __tablename__ = 'provider_data'
    id = Column(Integer, Sequence('provider_data_id_seq'), primary_key=True)
    parent_id = Column(Integer)
    name = Column(String)
    value = Column(String)

    def __str__(self):
        return "ProviderData({0}): provider_id={1} name={2} value={3}".format(self.id, self.parent_id, self.name, self.value)

class Controller(Base):
    """ DB object for a MOLNS controller. """
    __tablename__ = 'controllers'
    id = Column(Integer, Sequence('controller_id_seq'), primary_key=True)
    type = Column(String) #'EC2', 'Azure', 'OpenStack'
    name = Column(String)
    provider_id = Column(Integer)
    
    def __str__(self):
        return "Controller({0}): name={1} provider_id={2}".format(self.id, self.name, self.provider_id)

class ControllerData(Base):
    """ DB object to store the key/value pairs for a controller. """
    __tablename__ = 'controller_data'
    id = Column(Integer, Sequence('controller_data_id_seq'), primary_key=True)
    parent_id = Column(Integer)
    name = Column(String)
    value = Column(String)

    def __str__(self):
        return "ControllerData({0}): controller_id={1} name={2} value={3}".format(self.id, self.parent_id, self.name, self.value)

class WorkerGroup(Base):
    """ DB object for a MOLNS WorkerGroup. """
    __tablename__ = 'worker_groups'
    id = Column(Integer, Sequence('worker_group_id_seq'), primary_key=True)
    type = Column(String) #'EC2', 'Azure', 'OpenStack'
    name = Column(String)
    provider_id = Column(Integer)
    controller_id = Column(Integer)
    
    def __str__(self):
        return "WorkerGroup({0}): name={1} provider_id={2} controller_id={3}".format(self.id, self.name, self.provider_id, self.controller_id)

class WorkerGroupData(Base):
    """ DB object to store the key/value pairs for a worker groups. """
    __tablename__ = 'worker_group_data'
    id = Column(Integer, Sequence('worker_group_data_id_seq'), primary_key=True)
    parent_id = Column(Integer)
    name = Column(String)
    value = Column(String)

    def __str__(self):
        return "WorkerGrouprData({0}): worker_group_id={1} name={2} value={3}".format(self.id, self.parent_id, self.name, self.value)


class Instance(Base):
    """ DB object for a MOLNS VM instance. """
    __tablename__ = 'instances'
    id = Column(Integer, Sequence('instance_id_seq'), primary_key=True)
    type = Column(String) #'head-node' or 'worker'
    controller_id = Column(Integer)
    worker_group_id = Column(Integer)
    provider_id = Column(Integer)
    ip_address = Column(String)
    provider_instance_identifier = Column(String)
    
    def __str__(self):
        return "Instance({0}): provider_instance_identifier={1} provider_id={2} controller_id={3} worker_group_id={4}".format(self.id, self.provider_instance_identifier, self.provider_id, self.controller_id, self.worker_group_id)

class ExecJob(Base):
    """ DB object for MOLNS exec jobs. """
    __tablename__ = 'jobs'
    id = Column(Integer, Sequence('instance_id_seq'), primary_key=True)
    controller_id = Column(Integer)
    exec_str = Column(String)
    jobID = Column(String)
    date = Column(String)

    def __str__(self):
        return "ExecJob({0}): jobID={1} controller_id={2}, exec_str={3}".format(self.id, self.jobID, self.controller_id, self.exec_str)


class DatastoreException(Exception):
    pass

#############################################################
HANDLE_MAPPING = {
    'Provider':(Provider,ProviderData),
    'Controller':(Controller,ControllerData),
    'WorkerGroup':(WorkerGroup,WorkerGroupData),
}

#from OpenStackProvider import OpenStackProvider, OpenStackController, OpenStackWorkerGroup
#from EC2Provider import EC2Provider, EC2Controller, EC2WorkerGroup

def dynamic_module_import(name):
    mod = __import__(name)
    components = name.split('.')
    for comp in components[1:]:
        mod = getattr(mod, comp)
    return mod

def get_provider_handle(kind, ptype):
    """ Return object of 'kind' (Provider, Controller or WokerGroup) for provider of type 'ptype'.  Load the module if necessary. """
    #logging.debug("get_provider_handle(kind={0}, ptype={1})".format(kind, ptype))
    valid_handles = ['Provider', 'Controller', 'WorkerGroup']
    if kind not in valid_handles:
        raise DatastoreException("Unknown kind {0}".format(kind))
    if ptype not in VALID_PROVIDER_TYPES:
        raise DatastoreException("Unknown {1} type {0}".format(ptype, kind))
    cls_name = "{0}{1}".format(ptype, kind)
    pkg_name = "MolnsLib.{0}Provider".format(ptype)
    if pkg_name not in sys.modules:
        logging.debug("loading {0} from {1}".format(cls_name, pkg_name))
    pkg = dynamic_module_import(pkg_name)
    try:
        #logging.debug("dir(pkg={0})={1}".format(pkg, dir(pkg)))
        mod = getattr(pkg, cls_name)
    except AttributeError:
        raise DatastoreException("module {0} does not contain {1}".format(pkg_name, cls_name))
    return mod

#############################################################


class Datastore():
    """ Access API for the MOLNS datastore. """
    MOLNS_DATASTORE = 'molns_datastore.db'
    MOLNS_CONFIG_DIR = '.molns'

    def __init__(self, db_file=None, config_dir=None):
        """ Constructor. """
        if db_file is not None:
            self.engine = create_engine('sqlite:///{0}'.format(db_file))
            if config_dir is None:
                self.config_dir = os.path.abspath(os.path.dirname(db_file))
        elif config_dir is not None:
            if not os.path.exists(config_dir):
                os.makedirs(config_dir)
            self.engine = create_engine('sqlite:///{0}/{1}'.format(config_dir, self.MOLNS_DATASTORE))
            self.config_dir = config_dir
        else:
            if not os.path.exists(self.MOLNS_CONFIG_DIR):
                os.makedirs(self.MOLNS_CONFIG_DIR)
            self.engine = create_engine('sqlite:///{0}/{1}'.format(self.MOLNS_CONFIG_DIR, self.MOLNS_DATASTORE))

        Base.metadata.create_all(self.engine) # Create all the tables
        Session = sessionmaker(bind=self.engine)
        self.session = Session()

    def __del__(self):
        """ Destructor. """
        self.session.commit()
    

    def list_objects(self, kind):
        """ Get all the currently configured objects of kind (Provider, Controller, WorkerGroup).
        Args: 
            kind: a str, the kind of object, one of (Provider, Controller, WorkerGroup).
        Returns: a list of objects.
        """
        if kind not in HANDLE_MAPPING:
            raise DatastoreException("Unknown kind {0}".format(kind))
        (handle, d_handle) = HANDLE_MAPPING[kind]
        return self.session.query(handle).all()

    def create_object(self, ptype, name, kind, **kwargs):
        """ Setup a new objects of kind (Provider, Controller, WorkerGroup).
        
        Args:
            ptype: a str, the Provider type ('EC2', 'Azure', 'OpenStack').
            name: a str, the name of the object.
            kind: a str, the kind of object, one of (Provider, Controller, WorkerGroup).
            All **kwargs args are passed to the provide handle object constructor.
        """
        if kind not in HANDLE_MAPPING:
            raise DatastoreException("Unknown kind {0}".format(kind))
        (handle, d_handle) = HANDLE_MAPPING[kind]
        p = self.session.query(handle).filter_by(name=name).first()
        if p is not None:
            raise DatastoreException("{1} {0} already exists with type".format(name, kind, p.type))

        p_handle = get_provider_handle(kind, ptype)
        #logging.debug("create_object() {1}(name={0})".format(name, p_handle))
        p = p_handle(name=name, config_dir=self.config_dir)
        if 'provider_id' in kwargs:
            p.provider_id = kwargs['provider_id']
            #logging.debug("create_object() provider_id={0}".format(kwargs['provider_id']))
        if 'controller_id' in kwargs:
            p.controller_id = kwargs['controller_id']
            #logging.debug("create_object() controller_id={0}".format(kwargs['controller_id']))
        return p
    
    def delete_object(self, name, kind):
        """ Delete a objects of kind (Provider, Controller, WorkerGroup).
        
        Args:
            name: a str, the name of the object.
            kind: a str, the kind of object, one of (Provider, Controller, WorkerGroup).
        Raises:
            DatastoreException when provider is not found, or on error.
        """
        if kind not in HANDLE_MAPPING:
            raise DatastoreException("Unknown kind {0}".format(kind))
        (handle, d_handle) = HANDLE_MAPPING[kind]
        p = self.session.query(handle).filter_by(name=name).first()
        if p is None:
            raise DatastoreException("{0} {1} not found".format(kind, name))
        logging.debug("Deleting entry: {0}".format(p))
        self.session.delete(p)
        self.session.commit()
    
    def get_object(self, name, kind):
        """ Get a config object of of kind (Provider, Controller, WorkerGroup).
        
        Args:
            name: a str, the name of the object.
            kind: a str, the kind of object, one of (Provider, Controller, WorkerGroup).
        Returns:
            A config object.
        Raises:
            DatastoreException when object is not found, or on error.
        """
        if kind not in HANDLE_MAPPING:
            raise DatastoreException("Unknown kind {0}".format(kind))
        (handle, d_handle) = HANDLE_MAPPING[kind]
        p = self.session.query(handle).filter_by(name=name).first()
        if p is None:
            raise DatastoreException("{0} {1} not found".format(kind, name))
        return self._get_object_data(d_handle, kind, p.type, p)

    def get_object_by_id(self, id, kind):
        """ Get a config object of of kind (Provider, Controller, WorkerGroup).
        
        Args:
            id: an int, the id of the object.
            kind: a str, the kind of object, one of (Provider, Controller, WorkerGroup).
        Returns:
            A config object.
        Raises:
            DatastoreException when object is not found, or on error.
        """
        if kind not in HANDLE_MAPPING:
            raise DatastoreException("Unknown kind {0}".format(kind))
        (handle, d_handle) = HANDLE_MAPPING[kind]
        p = self.session.query(handle).filter_by(id=id).first()
        if p is None:
            raise DatastoreException("{0} {1} not found".format(kind, id))
        return self._get_object_data(d_handle, kind, p.type, p)

    def _get_object_data(self, d_handle, kind, ptype, p):
        data = {}
        p_data = self.session.query(d_handle).filter_by(parent_id=p.id).all()
        for d in p_data:
            data[d.name] = d.value

        p_handle = get_provider_handle(kind, ptype)
        #logging.debug("{2}(name={0}, data={1})".format(name,data,p_handle))
        ret = p_handle(name=p.name, config=data, config_dir=self.config_dir)
        ret.id = p.id
        ret.datastore = self
        if 'provider_id' in p.__dict__:
            #logging.debug("_get_object_data(): provider_id={0}".format(p.provider_id))
            try:
                ret.provider = self.get_object_by_id(id=p.provider_id, kind='Provider')
            except DatastoreException as e:
                logging.debug('Error: provider {0} not found'.format(p.provider_id))
                ret.provider = None
        if 'controller_id' in p.__dict__:
            #logging.debug("_get_object_data(): controller_id={0}".format(p.controller_id))
            try:
                ret.controller = self.get_object_by_id(id=p.controller_id, kind='Controller')
            except DatastoreException as e:
                logging.debug('Error: controller {0} not found'.format(p.controller_id))
                ret.controller = None
        return ret



    def save_object(self, config, kind):
        """ Save the configuration of a provider object.
        
        Args: 
            config: an infrastructure service provider object (e.g. OpenStackProvider)
            kind: a str, the kind of object, one of (Provider, Controller, WorkerGroup).
        """
        if kind not in HANDLE_MAPPING:
            raise DatastoreException("Unknown kind {0}".format(kind))
        (handle, d_handle) = HANDLE_MAPPING[kind]
        p = self.session.query(handle).filter_by(name=config.name).first()
        if p is None:
            # Add new entry.
            p = handle(name=config.name, type=config.type)
            self.session.add(p)
            #logging.debug("Created new DB entry: {0}".format(p))
        #print "save_object() config.__dict__={0}".format(config.__dict__)
        if 'provider_id' in config.__dict__:
            logging.debug("provider_id is in config.__dict__ {0} {1}".format(config.provider_id, type(config.provider_id)))
            p.provider_id = config.provider_id
        if 'controller_id' in config.__dict__:
            logging.debug("controller_id is in config.__dict__ {0}".format(config.controller_id))
            p.controller_id = config.controller_id
        #logging.debug("Updated DB entry: {0}".format(p))
        self.session.commit()

        data = config.config.copy()
        p_data = self.session.query(d_handle).filter_by(parent_id=p.id).all()
        for d in p_data:
            if d.name in data:
                d.value = data[d.name]
                del data[d.name]
            else:
                #logging.debug("Deleting entry: {0}".format(d))
                self.session.delete(d)
        for d in data.keys():
            dd = d_handle(parent_id=p.id, name=d, value=data[d])
            #logging.debug("Created new entry: {0}".format(dd))
            self.session.add(dd)
        self.session.commit()


    def get_instance_by_id(self, id):
        """ Create or get the value for an instance. """
        return self.session.query(Instance).filter_by(id=id).first()
    
    def get_instance(self, provider_instance_identifier, ip_address, provider_id=None, controller_id=None, worker_group_id=None):
        """ Create or get the value for an instance. """
        p = self.session.query(Instance).filter_by(provider_instance_identifier=provider_instance_identifier).first()
        if p is None:
            p = Instance(provider_instance_identifier=provider_instance_identifier, ip_address=ip_address, provider_id=provider_id, controller_id=controller_id, worker_group_id=worker_group_id)
            self.session.add(p)
            self.session.commit()
            #logging.debug("Creating instance: {0}".format(p))
        else:
            #logging.debug("Fetching instance: {0}".format(p))
            pass
        return p

    def get_controller_instances(self,controller_id=None):
        logging.debug("get_controller_instances by controller_id={0}".format(controller_id))
        ret = self.session.query(Instance).filter_by(controller_id=controller_id, worker_group_id=None).all()
        if ret is None:
            return []
        else:
            return ret

    def get_worker_instances(self,controller_id=None):
        #logging.debug("get_worker_instances by controller_id={0}".format(controller_id))
        ret = self.session.query(Instance).filter_by(controller_id=controller_id).filter(Instance.worker_group_id!=None).all()
        if ret is None:
            return []
        else:
            return ret


    def get_all_instances(self, provider_id=None, controller_id=None, worker_group_id=None):
        if provider_id is not None:
            #logging.debug("get_all_instances by provider_id={0}".format(provider_id))
            ret = self.session.query(Instance).filter_by(provider_id=provider_id).all()
        elif controller_id is not None:
            #logging.debug("get_all_instances by controller_id={0}".format(controller_id))
            ret = self.session.query(Instance).filter_by(controller_id=controller_id).all()
        elif worker_group_id is not None:
            #logging.debug("get_all_instances by worker_group_id={0}".format(worker_group_id))
            ret = self.session.query(Instance).filter_by(worker_group_id=worker_group_id).all()
        else:
            ret = self.session.query(Instance).all()
        if ret is None:
            return []
        else:
            return ret

    def delete_instance(self, instance):
        """ Delete an instance. """
        #logging.debug("Deleting instance: {0}".format(instance))
        self.session.delete(instance)
        self.session.commit()

    def get_all_jobs(self, controller_id=None):
        if controller_id is not None:
            #logging.debug("get_all_instances by controller_id={0}".format(controller_id))
            ret = self.session.query(ExecJob).filter_by(controller_id=controller_id).all()
        else:
            ret = self.session.query(ExecJob).all()
        if ret is None:
            return []
        else:
            return ret

    def get_job(self,  jobID):
        """ Get the objet for a job. """
        #logging.debug("get_job(jobID={0})".format(jobID))
        try:
            id = int(jobID)
            j = self.session.query(ExecJob).filter_by(id=id).first()
        except Exception:
            j = self.session.query(ExecJob).filter_by(jobID=jobID).first()
        if j is None:
            raise DatastoreException("Job {0} not found".format(jobID))
        return j
    
    def start_job(self,  controller_id=None, exec_str=None):
        """ Create the objet for a job. """
        date_str = str(datetime.datetime.now())
        jobID = str(uuid.uuid4())
        j = ExecJob(jobID=jobID, controller_id=controller_id, exec_str=exec_str, date=date_str)
        self.session.add(j)
        self.session.commit()
        logging.debug("Creating ExecJob: {0}".format(j))
        return j

    def delete_job(self, job):
        self.session.delete(job)
        self.session.commit()




