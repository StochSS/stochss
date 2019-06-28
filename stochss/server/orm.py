import os, json
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine, select, Table, Column, MetaData, ForeignKey, Boolean, Integer, String, DateTime, Float, UniqueConstraint

Base = declarative_base()

class Model(Base):
    __tablename__ = 'model'

    id = Column(Integer, primary_key=True)
    latest_version = Column(Integer)
    username = Column(String)
    name = Column(String)
    public = Column(Boolean)
    is_stochastic = Column(Boolean)
    is_spatial = Column(Boolean)
    
    # Relationships (one-to-many)
    versions = relationship("ModelVersion", back_populates="model", cascade='all, delete, delete-orphan')
    parameters = relationship("Parameter", back_populates="model")
    reactions = relationship("Reaction", back_populates="model")
    species = relationship("Specie", back_populates="model")
    reactants = relationship("Reactant", back_populates="model")
    products = relationship("Product", back_populates="model")
    rateRules = relationship("RateRule", back_populates="model")

    def __repr__(self):
        return json.dumps({
            'id': self.id,
            'latest_version': self.latest_version,
            'username': self.username,
            'name': self.name,
            'public': self.public,
            'is_stochastic': self.is_stochastic,
            'is_spatial': self.is_spatial,
            'versions': json.loads(str(self.versions))
        })


class ModelVersion(Base):
    __tablename__ = 'model_version'

    id = Column(Integer, primary_key=True)
    version = Column(Integer)

    # Foreign Keys 
    model_id = Column(Integer, ForeignKey("model.id"), nullable=False)

    # Relationships (many-to-one) 
    model = relationship("Model", back_populates="versions")

    # Relationships (one-to-one)
    simSettings = relationship("SimSettings", uselist=False, back_populates="version", cascade='all, delete')

    # Relationships (one-to-many)
    reactions = relationship("Reaction", back_populates="version", cascade='all, delete, delete-orphan')
    parameters = relationship("Parameter", back_populates="version", cascade='all, delete, delete-orphan')
    species = relationship("Specie", back_populates="version", cascade='all, delete, delete-orphan')
    reactants = relationship("Reactant", back_populates="version", cascade='all, delete, delete-orphan')
    products = relationship("Product", back_populates="version", cascade='all, delete, delete-orphan')
    rateRules = relationship("RateRule", back_populates="version", cascade='all, delete, delete-orphan')

    def __repr__(self):
        return json.dumps({
            'id': self.id,
            'name': self.model.name,
            'version': self.version,
            'simSettings': json.loads(str(self.simSettings)),
            'species': json.loads(str(self.species)),
            'parameters': json.loads(str(self.parameters)),
            'reactions': json.loads(str(self.reactions)),
            'rateRules': json.loads(str(self.rateRules))
        }, default=str)


class SimSettings(Base):
    __tablename__ = 'simSettings'

    id = Column(Integer, primary_key=True)
    is_stochastic = Column(Boolean)
    endSim = Column(Integer)
    timeStep = Column(Integer)
    realizations = Column(Integer)
    algorithm = Column(String)
    ssaSeed = Column(Integer)
    tauSeed = Column(Integer)
    hybridSeed = Column(Integer)
    tauTolerance = Column(Float)
    hybridTolerance = Column(Float)
    switchingTolerance = Column(Float)
    relativeTolerance = Column(Float)
    absoluteTolerance = Column(Float)

    # Foreign Keys
    model_version_id = Column(Integer, ForeignKey("model_version.id"), nullable=False)

    # Relationships (one to one)
    version = relationship("ModelVersion", back_populates="simSettings")

    def __repr__(self):
        return json.dumps({
            'is_stochastic': self.is_stochastic,
            'endSim': self.endSim,
            'timeStep': self.timeStep,
            'stochasticSettings': {
              'realizations': self.realizations,
              'algorithm': self.algorithm,
              'ssaSettings': {
                'seed': self.ssaSeed
              },
              'tauLeapingSettings': {
                'seed': self.tauSeed,
                'tauTolerance': self.tauTolerance
              },
              'hybridTauSettings': {
                'seed': self.hybridSeed,
                'tauTolerance': self.hybridTolerance,
                'switchingTolerance': self.switchingTolerance
              }
            },
            'deterministicSettings': {
              'relativeTolerance': self.relativeTolerance,
              'absoluteTolerance': self.absoluteTolerance
            }
        })


class Reaction(Base):
    __tablename__ = 'reaction'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    annotation = Column(String)
    massaction = Column(Boolean)
    reaction_type = Column(String)
    propensity = Column(String)
    subdomains = Column(String)
    
    # Foreign Keys
    model_id = Column(Integer, ForeignKey("model.id"), nullable=False)
    version_id = Column(Integer, ForeignKey("model_version.id"), nullable=False)
    parameter_id = Column(Integer, ForeignKey("parameter.id"), nullable=False)

    # Relationships (one-to-one)
    rate = relationship("Parameter", back_populates="reaction")

    # Relationships (many-to-one)
    model = relationship("Model", back_populates="reactions")
    version = relationship("ModelVersion", back_populates="reactions") 
    
    # Relationships (one-to-many)
    reactants = relationship("Reactant", back_populates="reaction",
            cascade='all, delete, delete-orphan')
    products = relationship("Product", back_populates="reaction",
            cascade='all, delete, delete-orphan')


    def __repr__(self):
        return json.dumps({
            'id': self.id,
            'name': self.name,
            'massaction': self.massaction,
            'rate': json.loads(str(self.rate)),
            'reactants': json.loads(str(self.reactants)),
            'products': json.loads(str(self.products)),
            'annotation': self.annotation,
            'reaction_type': self.reaction_type,
            'propensity': self.propensity,
            'subdomains': self.subdomains.split(',')
        })


class Parameter(Base):
    __tablename__ = 'parameter'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    value = Column(Float)

    # Foreign Keys
    model_id = Column(Integer, ForeignKey("model.id"), nullable=False)
    version_id = Column(Integer, ForeignKey("model_version.id"), nullable=False)

    # Relationships (one-to-one)
    reaction = relationship("Reaction", back_populates="rate")

    # Relationships (many-to-one)
    model = relationship("Model", back_populates="parameters")
    version = relationship("ModelVersion", back_populates="parameters")


    def __repr__(self):
        return json.dumps({
            'id': self.id,
            'name': self.name,
            'value': self.value
        })


class Specie(Base):
    __tablename__ = 'specie'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    value = Column(Float)
    mode = Column(String)
    diffusionCoeff = Column(Float)
    subdomains = Column(String)

    # Foreign Keys
    model_id = Column(Integer, ForeignKey("model.id"), nullable=False)
    version_id = Column(Integer, ForeignKey("model_version.id"), nullable=False)

    # Relationships (many-to-one)
    model = relationship("Model", back_populates="species")
    version = relationship("ModelVersion", back_populates="species")

    # Relationships (one-to-many)
    reactants = relationship("Reactant", back_populates="specie")
    products = relationship("Product", back_populates="specie")
    rateRules = relationship("RateRule", back_populates="specie")

    def __repr__(self):
        return json.dumps({
            'id': self.id,
            'name': self.name,
            'spatialSpecies': {
              'diffusionCoeff': self.diffusionCoeff,
              'subdomains': self.subdomains.split(',')
            },
            'nonspatialSpecies': {
              'value': self.value,
              'mode': self.mode
            }
        })


class RateRule(Base):
    __tablename__ = 'rateRule'

    id = Column(Integer, primary_key=True)
    rule = Column(String)

    # Foreign Keys
    model_id = Column(Integer, ForeignKey("model.id"), nullable=False)
    version_id = Column(Integer, ForeignKey("model_version.id"), nullable=False)
    specie_id = Column(Integer, ForeignKey("specie.id"), nullable=False)

    # Relationships (many-to-one)
    model = relationship("Model", back_populates="rateRules")
    version = relationship("ModelVersion", back_populates="rateRules")
    specie = relationship("Specie", back_populates="rateRules")

    def __repr__(self):
        return json.dumps({
            'id': self.id,
            'rule': self.rule,
            'specie': json.loads(str(self.specie))
        })


class Reactant(Base):
    __tablename__ = 'reactant'

    id = Column(Integer, primary_key=True)
    ratio = Column(Integer)
    
    # Foreign Keys
    model_id = Column(Integer, ForeignKey("model.id"), nullable=False)
    version_id = Column(Integer, ForeignKey("model_version.id"), nullable=False)
    specie_id = Column(Integer, ForeignKey("specie.id"), nullable=False)
    reaction_id = Column(Integer, ForeignKey("reaction.id"), nullable=False)
    
    # Relationships (many-to-one)
    model = relationship("Model", back_populates="reactants")
    version = relationship("ModelVersion", back_populates="reactants")
    reaction = relationship("Reaction", back_populates="reactants")
    specie = relationship("Specie", back_populates="reactants")

    def __repr__(self):
        return json.dumps({
            'id': self.id,
            'ratio': self.ratio,
            'specie': json.loads(str(self.specie))
        })


# This is a mirror of the Reactant class (for now KISS > DRY)
class Product(Base):
    __tablename__ = 'product'

    id = Column(Integer, primary_key=True)
    ratio = Column(Integer)

    # Foreign Keys
    model_id = Column(Integer, ForeignKey("model.id"), nullable=False)
    version_id = Column(Integer, ForeignKey("model_version.id"), nullable=False)
    specie_id = Column(Integer, ForeignKey("specie.id"), nullable=False)
    reaction_id = Column(Integer, ForeignKey("reaction.id"), nullable=False)
    
    # Relationships (many-to-one)
    model = relationship("Model", back_populates="products")
    version = relationship("ModelVersion", back_populates="products")
    reaction = relationship("Reaction", back_populates="products")
    specie = relationship("Specie", back_populates="products")

    def __repr__(self):
        return json.dumps({
            'id': self.id,
            'ratio': self.ratio,
            'specie': json.loads(str(self.specie))
        })


