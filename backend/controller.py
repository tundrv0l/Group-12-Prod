'''----------------- 
# Title: controller.py
# Author: Parker Clark
# Date: 1/28/2025
# Description: MA controller to route requests to the appropriate function.
-----------------'''

#---Imports---#
from flask import Blueprint, request, jsonify
from functools import wraps
import os

#---Imports for the solvers---#
from backend.solvers import wff_solver
from backend.solvers import propositional_solver
from backend.solvers import recursion_solver
from backend.solvers import properties_solver
from backend.solvers import closures_solver
from backend.solvers import partition_solver
from backend.solvers import special_solver
from backend.solvers import hasse_solver
from backend.solvers import Warshall_solver
from backend.solvers import graph_solver
from backend.solvers import adjacency_solver
from backend.solvers import weighted_graph_solver
from backend.solvers import matrix_solver
from backend.solvers import matrix_multiply_solver
from backend.solvers import cycle_solver
from backend.solvers import disjoint_solver
from backend.solvers import compisitions_solver
from backend.solvers import table_solver
from backend.solvers import topological_solver
from backend.solvers import critical_solver
from backend.solvers import binary_trees_solver
from backend.solvers import tree_to_array_solver
from backend.solvers import array_to_tree_solver
from backend.solvers import tree_notation_solver
from backend.solvers import set_function_solver
from backend.solvers import order_solver
from backend.solvers import master_solver
from backend.solvers import set_complement_solver
from backend.solvers import power_set_solver 
from solvers.util import exceptions

#---Imports for the reporter---#
from backend.reporter import send_email

# Define a Blueprint for the controller
controller_bp = Blueprint('controller', __name__)

# Define a decorator to check for the API key in the request headers
def require_api_key(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        api_key = request.headers.get('X-API-Key')
        expected_key = os.getenv('API_KEY')
        if not api_key or api_key != expected_key:
            return jsonify({'error': 'Unauthorized access'}), 401
        
        return f(*args, **kwargs)
    return decorated_function

@controller_bp.route('/solve/<solver_type>', methods=['POST'])
@require_api_key
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
    try:
        data = request.json
        print(data)
        
        result = solve_algorithim(solver_type, data)
        print(f"Result: {result}")
        return jsonify(result)
    
    # If the solver encounters a defined error, return the error message to the user.
    except exceptions.CalculateError as e:
        return jsonify({'Calculation Error': str(e)})


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
        data = data["hypotheses"]
        return propositional_solver.solve(data['hypotheses'], data['conclusion'])
    elif solver_type == 'recursive-definitions':
        data = data["formula"]
        return recursion_solver.solve(data['formula'], data['baseCase'], data['n'])
    elif solver_type == 'basic-set-functions':
        return set_function_solver.solve(data)
    elif solver_type == 'power-set':

        sets_dict = data.get("sets", {})
        iterations = data.get("iterations", 1)

        return power_set_solver.solve(sets_dict, iterations)
    elif solver_type == 'set-complement':
        return set_complement_solver.solve(data["universal_set"], data["subset"])
    elif solver_type == 'binary-unary-operators':
        # Call the appropriate function for binary and unary operators
        pass
    elif solver_type == 'cartesian-products':
        # Call the appropriate function for cartesian products
        pass
    elif solver_type == 'properties-of-relations':
        return properties_solver.solve(data["set"], data["relation"])
    elif solver_type == 'closure-axioms':
        return closures_solver.solve(data["set"], data["relation"])
    elif solver_type == 'partitions':
        return partition_solver.solve(data["set"], data["relation"])
    elif solver_type == 'partial-orderings':
        return special_solver.solve(data["set"], data["relation"])
    elif solver_type == 'hasse-diagrams':
        return hasse_solver.solve(data["set"], data["relation"])
    elif solver_type == 'critical-paths':
        return critical_solver.solve(data)
    elif solver_type == 'pert-diagrams':
        return table_solver.solve(data)
    elif solver_type == 'topological-sorting':
        return topological_solver.solve(data)
    elif solver_type == 'permutations-cycle':
        return cycle_solver.solve(data['input'])
    elif solver_type == 'compositions':
        return compisitions_solver.solve(data['setOne']['setOne'], data['setOne']['setTwo'])
    elif solver_type == 'disjoint-cycles':
        return disjoint_solver.solve(data['input'])
    elif solver_type == 'order-of-magnitude':
        # Parse the input data from the frontend
        order = int(data.get("order", 0))
        scalars_f = data.get("coefficients1", [])
        scalars_g = data.get("coefficients2", [])
        use_log = data.get("useLog", False)
        use_root = data.get("useRoot", False)

        return order_solver.solve(order, scalars_f, scalars_g)
    elif solver_type == 'master-theorem':
        return master_solver.solve(data["a"], data["b"], data["c"])
    elif solver_type == 'boolean-matrices':
        if data["operation"] == "MEET/JOIN":
            return matrix_solver.solve(data["matrix1"], data["matrix2"])
        else:
            return matrix_multiply_solver.solve(data["matrix1"], data["matrix2"])
    elif solver_type == 'graphs':
        return graph_solver.solve(data["pairs"], data["type"], data["isIsomorphic"], data["secondInput"])
    elif solver_type == 'adjacency-matrices-lists':
        return adjacency_solver.solve(data["input"], data["type"])
    elif solver_type == 'weighted-graphs':
        return weighted_graph_solver.solve(data["input"], data["type"])
    elif solver_type == 'binary-trees':
        return binary_trees_solver.solve(data["input"], data["choice"])
    elif solver_type == 'array-to-tree':
        return array_to_tree_solver.solve(data["input"])
    elif solver_type == 'tree-to-array':
        return tree_to_array_solver.solve(data["input"], data["choice"])
    elif solver_type == 'tree-notation':
        
        # Map the operation number to the corresponding function name
        operation_num = int(data.get("operation", 1))
        operation_map = {
            1: 'build_from_level',
            2: 'build_from_table', 
            3: 'reconstruct_from_preorder',
            4: 'reconstruct_from_postorder',
            5: 'build_from_math'
        }
        operation = operation_map.get(operation_num)

        return tree_notation_solver.solve(data["input"], data["secondaryInput"], operation)
    elif solver_type == 'warshalls-algorithm':
        return Warshall_solver.solve(data["input"])
    else:
        return {'error': 'Unsupported solver type'}, 400

@controller_bp.route('/report-problem', methods=['POST'])
@require_api_key
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
