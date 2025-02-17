'''----------------- 
# Title: controller.py
# Author: Parker Clark
# Date: 1/28/2025
# Description: MA controller to route requests to the appropriate function.
-----------------'''

#---Imports---#
from flask import Blueprint, request, jsonify
from backend.solvers import wff_solver
from backend.reporter import send_email

# Define a Blueprint for the controller
controller_bp = Blueprint('controller', __name__)

@controller_bp.route('/solve/<solver_type>', methods=['POST'])
def solve(solver_type):
    '''
        An api endpoint to solve a problem and derive the specified algorithm.

        Parameters
        ----------
        solver_type (str): 
            The type of solver to use. Baked in to the api url

        Returns
        ----------
        result: json
            Returned the serialized json of the result and return to the client.
    '''
    data = request.json
    print(data)
    result = solve_algorithim(solver_type, data)
    return(jsonify(result))


def solve_algorithim(solver_type, data):
    '''
        A function to deduce and call proper solver functions.

        Parameters
        ----------
        solver_type (str): 
            The type of solver to use passed in from solve()
        data (json): 
            The data input to be passed to the solver function

        Returns
        ----------
        result: json
            Returned the serialized json of the result and return to the client.
    '''
    if solver_type == 'wff':
        return wff_solver.solve(data['formula'])
    elif solver_type == 'propositional-logic':
        # Call the appropriate function for propositional logic
        pass
    elif solver_type == 'recursive-definitions':
        # Call the appropriate function for recursive definitions
        pass
    elif solver_type == 'basic-set-functions':
        # Call the appropriate function for basic set functions
        pass
    elif solver_type == 'power-set':
        # Call the appropriate function for power set
        pass
    elif solver_type == 'set-complement':
        # Call the appropriate function for set complement
        pass
    elif solver_type == 'binary-unary-operators':
        # Call the appropriate function for binary and unary operators
        pass
    elif solver_type == 'cartesian-products':
        # Call the appropriate function for cartesian products
        pass
    elif solver_type == 'properties-of-relations':
        # Call the appropriate function for properties of relations
        pass
    elif solver_type == 'closure-axioms':
        # Call the appropriate function for closure axioms
        pass
    elif solver_type == 'equivalence-relations':
        # Call the appropriate function for equivalence relations
        pass
    else:
        return jsonify({'error': 'Unsupported solver type'}), 400

@controller_bp.route('/report-problem', methods=['POST'])
def report_problem():
    '''
        A function that calls the send_email function to send an email 
          to the webmaster with a report of a problem.

        Returns
        ----------
        None
    '''

    # Get the data from the request
    data = request.json
    
    # Send the email using the send_email function
    successful = send_email.send_email(data['email'], data['issue'])

    # Check if the email was sent successfully
    if successful:
        return jsonify({'message': 'Email sent successfully'}), 200
    else:
        return jsonify({'error': 'Failed to send email'}), 500