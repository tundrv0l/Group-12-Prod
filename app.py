'''----------------- 
# Title: app.py
# Author: Parker Clark
# Date: 1/26/2025
# Description: Main API endpoint for the application.
-----------------'''

#---Imports---#
from flask import Flask
from flask_cors import CORS
from backend.controller import controller_bp
import os

cors_origin = os.environ.get('CORS_ORIGIN','http://localhost:3000')

app = Flask(__name__)
CORS(app, origins=[cors_origin])

app.register_blueprint(controller_bp)

if __name__ == '__main__':
    app.run(host = '0.0.0.0', port = 5000, debug = True, origins=[cors_origin])
