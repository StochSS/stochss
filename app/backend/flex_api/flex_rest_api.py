__version__ = '1.0.0'

import sys
import os
sys.path.append(os.path.dirname(__file__))

from flex_state import FlexJobState, FlexVMState

from flask import Flask, jsonify
app = Flask(__name__)

@app.route('/')
def index():
    return jsonify({'name': 'Flex API',
                    'version': __version__})

@app.route('/state')
def state():
    return jsonify({'state': FlexVMState.UNPREPARED})

@app.route('/job_state')
def job_state():
    return jsonify({'job_state': FlexJobState.IDLE})

if __name__ == '__main__':
    app.run(host='0.0.0.0')