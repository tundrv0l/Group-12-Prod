'''----------------- 
# Title: app.py
# Author: Parker Clark
# Date: 1/26/2025
# Description: Main API endpoint for the application.
-----------------'''

#---Imports---#
from flask import Flask, request, jsonify
from flask_cors import CORS
import backend.controller as controller

app = Flask(__name__)
CORS(app)

#---Routes---#
# Note: I want to make this a generic route that can handle any solver and just handle mapping to controller, but idk
@app.route('/solve', methods=['POST'])
def solve():
    data = request.json
    solver_type = data.get('solver_type')
    if not solver_type:
        return jsonify({'error': 'solver_type is required'}), 400
    result = controller.solve(data)
    return jsonify(result)


if __name__ == '__main__':
    pass