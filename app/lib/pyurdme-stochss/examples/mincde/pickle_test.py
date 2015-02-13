from pyurdme import pyurdme
from mincde import mincde
import pickle

model = mincde()
model_str = pickle.dumps(model)

model_unpickled = pickle.loads(model_str)
pyurdme.urdme(model_unpickled)


