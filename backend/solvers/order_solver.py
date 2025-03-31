# File: order_solver.py
# Author: Jacob Warren
# Solves: 5.5.1-5.5.6

import json
import os
import sys

# Append the parent directory to the path so we can import in utility
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from solvers.util import exceptions

'''
==========
parameters
==========
order: an integer represnting the order of the two functions
    - example: 2
    - restrictions: can't be negative
scalar_f: a list representing of floats reprenting the scalars of the 
          first function in order-ascending order
    - example: [2.5, 0]
    - restrictions: length is equal to order
scalar_g: a list representing of floats reprenting the scalars of the 
          second function in order-ascending order
    - example: [0, 3.44]
    - restrictions: length is equal to order
======
result
======
string: a string expressing the inequality with the required constants in LaTeX
        valid syntax (in a given math-scope)
====
notes
====
For both the root (5.5.4) and log (5.5.6) functions, 
just use the polynomial inside them as the input data.

5.5.5 is unsolved for now.
'''
def solve(order, scalars_f, scalars_g):

    print(f"order: {order}, scalars_f: {scalars_f}, scalars_g: {scalars_g}")
    result_list = [0, 0, 0]
    result = {
        "Result": "\\forall x\\geq 0, 0g(x)\\leq f(x)\\leq 0g(x)" 
    }

    if scalars_g[order] == 0:
        if scalars_f[order] == 0:
            return json.dumps(result)
        else:
            raise exceptions.CalculateError(f"Not possible.")
    else:
        if scalars_f[order] == 0:
            raise exceptions.CalculateError(f"Not possible.")

    c_1 = (1/2) * scalars_f[order] / scalars_g[order];
    c_2 = (2) * scalars_f[order] / scalars_g[order];
    
    h_1 = [scalars_f[i] - c_1 * scalars_g[i] for i in range(order)]
    h_2 = [c_2 * scalars_g[i] - scalars_f[i] for i in range(order)]

    M_1 = max(abs(h_1[i]) for i in range(order))
    M_2 = max(abs(h_2[i]) for i in range(order))

    n_0 = max(M_1 / (c_1 * scalars_g[order]), M_2 / (c_2 * scalars_g[order]))

    result_list[0] = n_0
    result_list[1] = c_1
    result_list[2] = c_2

    result = {
        "Result": f"\\forall x\\geq {result_list[0]:.2f}, {result_list[1]:.2f}g(x)\\leq f(x)\\leq {result_list[2]:.2f}g(x)"
    }

    return json.dumps(result)
