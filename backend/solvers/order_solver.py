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
    - example: [1, 3.44]
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
    # order of magnitude theorem only applies to nonnegative leading
    # coefficient, and 0 implies its not the right order
    if scalars_g[0] <= 0 or scalars_f[0] <= 0:
        raise exceptions.CalculateError(f"Bad leading coefficient.")
        
    # simple coefficients that work
    c_1 = (1/2) * scalars_f[0] / scalars_g[0];
    c_2 = (2) * scalars_f[0] / scalars_g[0];

    # leading coefficients of difference polynomials
    d_1 = (1/2) * scalars_f[0]
    d_2 = scalars_f[0]

    # difference polynomials normalized by leading coefficient (same zeros)
    scalars_1 = [(c_1 * scalars_g[i] - scalars_f[i]) / d_1 for i in range(0, order + 1)]
    scalars_2 = [(scalars_f[i] - c_2 * scalars_g[i]) / d_2 for i in range(0, order + 1)]

    # Cauchy Bound (pre-divided by leading)
    bound_1 = 1
    bound_2 = 1
    for i in range(1, order + 1):
        bound_1 = max(bound_1, 1 + abs(scalars_1[i]))
        bound_2 = max(bound_2, 1 + abs(scalars_2[i]))

    # the point at which neither difference polynomial can have 
    # no more zeros (the point where the scaled polynomials can 
    # never cross f again)
    n_0 = max(bound_1, bound_2)

    result = {
        "Result": f"\\forall x\\geq {n_0:.2f}, {c_1:.2f}g(x)\\leq f(x)\\leq {c_2:.2f}g(x)"
    }

    return json.dumps(result)
