'''----------------- 
# Title: diagnostics.py
# Author: Parker Clark
# Date: 3/5/2025
# Description: Blueprint for the diagnostics endpoints.
-----------------'''

#---Imports---#
from flask import Blueprint, request, jsonify
from datetime import datetime
import os 
import json
import time

from backend.database import manager

# Init the blueprint
diagnostics_bp = Blueprint('diagnostics', __name__)

# Create a logs directory if its not there
LOGS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../logs/diagnostics')
os.makedirs(LOGS_DIR, exist_ok=True)

print(LOGS_DIR)

@diagnostics_bp.route('/diagnostics', methods=['POST'])
def receive_diagnostics():
    '''
        An api endpoint to store/send diagnositcs.

        Parameters
        ----------
        None

        Returns
        ----------
        result: json
            Reesponse of if the call was successful or not.
    '''

    try:
        # Extract diagnostic payload
        diagnostic_data = request.json

        # Generate a unique filename w/ timestamp and add it to log path
        timestamp = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")
        filename = f"log_{timestamp}.json"
        filepath = os.path.join(LOGS_DIR, filename)

        '''
        # Start Database Stuff
        # Author: Jacob Warren
        
        # the db filename
        database = manager.Database(os.path.join(LOGS_DIR, "diagnostics.db"))

        # generate user_id (unique per diagnostic send for now, eventually will have
        # a cookie on the frontend)
        user_data = f"{diagnostic_data['duration']}{len(diagnostic_data['interactions'])}{diagnostic_data['userAgent']}{diagnostic_data['Language']}{diagnostic_data['timestamp']}"
        user_id = hash(user_data)

        # write data for each interaction
        count = 0
        for interaction in diagnostic_data["interactions"]:
            # only care about solver inputs/outputs
            if interaction["type"] != "SOLVER_RESULT":
                continue

            # timestamp of interaction as an integer
            in_time = int(datetime.fromisoformat(interaction["timestamp"][:-1]).timestamp() * 1000)
            
            # on the first interaction add user entry 
            # (so our first_connect_time is correct)
            if count == 0:
                database.add_user(
                    user_id,
                    diagnostic_data["userAgent"],
                    diagnostic_data["Language"],
                    in_time
                )

            # only add solver type if it doesn't already exist
            solver_name = interaction["solver"]
            if database.get_solver(solver_name) == None:
                database.add_solver(solver_name)
            
            # stringify input
            input_text = ""
            for input_type in interaction["input"]:
                input_text += f"{input_type}: {interaction['input'][input_type]}\n"

            # flip hasError to success
            success = True
            if interaction["hasError"]:
                success = False
            
            # add input and output entries referencing the user_id
            database.add_input(user_id, solver_name, input_text, in_time)
            database.add_output(user_id, in_time, success, interaction["executionTimeMs"])
    
            count = count + 1
        
        # close cursor and connection for db
        database.close()
        
        # End Database Stuff
        '''

        with open(filepath, 'w') as file:
            json.dump(diagnostic_data, file, indent=2)
        
        return jsonify({"status": "Diagnostics Received"})

    except Exception as e:
        print(f"Error processing diagnostics: {str(e)}")
        return jsonify({"status": "Diagnostic Error", "message": str(e)}), 500
