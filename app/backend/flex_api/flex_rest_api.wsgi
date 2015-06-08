import sys
import os
sys.path.append(os.path.dirname(__file__))

import logging, sys
logging.basicConfig(stream=sys.stderr)

from flex_rest_api import app as application