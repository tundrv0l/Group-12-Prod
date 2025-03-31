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
order: an integer reprsenting the order of the two functions
    - example: 2
    - restrictions: can't be negative
scalar_f: a list representing of floats reprenting the scalars of the 
          first function in order-descending order
    - example: [2.5, 1]
    - restrictions: length is equal to order
scalar_g: a list representing of floats reprenting the scalars of the 
          second function in order-descending order
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
    result = {
        "Result": "\\forall x\\geq 0, 0g(x)\\leq f(x)\\leq 0g(x)" 
    }

    if scalars_g[0] == 0:
        if scalars_f[0] != 0:
            return json.dumps(result)
        else:
            raise exceptions.CalculateError(f"Not possible.")
    else:
        if scalars_f[0] == 0:
            raise exceptions.CalculateError(f"Not possible.")

    
        
    c_1 = (1/2) * abs(scalars_f[0] / scalars_g[0]);
    c_2 = (2) * abs(scalars_f[0] / scalars_g[0]);

    if (scalars_g[0] < 0 and scalars_f[0] < 0):
        c_1 *= 4
        c_2 *= 0.25
    elif (scalars_g[0] < 0 and scalars_f[0] > 0):
        c_1 *= -1
        c_2 *= -1
    elif (scalars_g[0] > 0 and scalars_f[0] < 0):
        c_1 *= -4
        c_2 *= -0.25

    n_0 = 100
    while True:
        f_value = 0
        g_value = 0
        for i in range(order + 1):
            f_value += scalars_f[i] * (n_0 ** (order - i))
            g_value += scalars_g[i] * (n_0 ** (order - i))

        if c_1 * g_value <= f_value and c_2 * g_value >= f_value:
            break

        n_0 += 100

    result = {
        "Result": f"\\forall x\\geq {n_0:.2f}, {c_1:.2f}g(x)\\leq f(x)\\leq {c_2:.2f}g(x)"
    }

    return json.dumps(result)
