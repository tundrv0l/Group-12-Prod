'''----------------- 
# Title: controller.py
# Author: Parker Clark
# Date: 1/28/2025
# Description: MA controller to route requests to the appropriate function.
-----------------'''

#---Imports---#
from flask import Blueprint, request, jsonify
from backend.solvers import wff_solver

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

@controller_bp.route('/report-problem', methods=['POST'])
def report_problem():
    '''
        An api endpoint to report a problem.

        Parameters
        ----------
        None

        Returns
        ----------
        result: json
            Returned the serialized json of the result and return to the client.
    '''
    data = request.json
    email = data['email']
    issue = data['issue']
    send_report(email, issue)
    return(jsonify({'status': 'success'}))

def send_report(email, issue):
    '''
        A function to send a report of an issue.

        Parameters
        ----------
        email (str): 
            The email of the user reporting the issue
        issue (str): 
            The issue being reported

        Returns
        ----------
        None
    '''
    pass

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
        # Implement and return the result of the propositional logic solver
        pass
    elif solver_type == 'recursive-definition':
        # Implement and return the result of the recursive definition solver
        pass
    else:
        return jsonify({'error': 'Unsupported solver type'}), 400