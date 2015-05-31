__version__ = '1.0.0'

import sys
import os
import logging
import pprint

sys.path.append(os.path.dirname(__file__))

from flex_state import FlexJobState, FlexVMState

from flask import Flask, jsonify, request
app = Flask(__name__)

@app.route('/')
def index():
    return jsonify({'name': 'Flex API',
                    'version': __version__})

@app.route('/state', methods=['GET'])
def state():
    state_info = FlexVMState.get_state_info()
    logging.info('state_info =\n{0}'.format(pprint.pformat(state_info)))
    return jsonify(state_info)

@app.route('/deregister', methods=['GET', 'POST'])
def deregister():
    data = request.get_json()
    response_info = FlexVMState.deregister(request_info=data)
    return jsonify(response_info)

@app.route('/prepare', methods=['GET', 'POST'])
def prepare():
    data = request.get_json()
    response_info = FlexVMState.prepare(request_info=data)
    return jsonify(response_info)

if __name__ == '__main__':
    app.run(host='0.0.0.0')