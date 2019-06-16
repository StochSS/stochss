import sys
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

sys.path.insert(0, '..')

from stochss.orm import Model, ModelVersion, Specie, Parameter, Reaction, Reactant, Product

from util import get_db_url

db_url = get_db_url()

engine = create_engine(db_url, echo=True)
Session = sessionmaker(bind=engine)
session = Session()
args = {
    'latest_version': 1,
    'username': 'popensesame',
    'name': 'M1',
    'public': False,
    'is_stochastic': True,
    'is_spatial': False,
}

model = Model(**args)
version= ModelVersion(version=1)

specie = Specie(name='S0', value=1)
specie.model = model
param = Parameter(name='k0', value=1)
param.model = model

reactant = Reactant(ratio=1)
product = Product(ratio=1)

product.specie = specie
product.model = model
product.version = version

reactant.specie = specie
reactant.model = model
reactant.version = version

reaction = Reaction(name="R0", annotation="hi", massaction=False)
reaction.parameters = [ param ]
reaction.products = [ product ]
reaction.reactants = [ reactant ]
reaction.model = model

version.reactions = [ reaction ]
version.species = [ specie ]
version.parameters = [ param ]

model.versions = [ version ]

session.add(model)
session.commit()

print(str(model))
