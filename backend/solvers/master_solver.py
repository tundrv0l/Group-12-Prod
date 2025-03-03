# File: master_solver.py
# Author: Jacob Warren
# Solves: 5.5.21-5.5.26

import json
import math

from util import exceptions

'''
==========
parameters
==========
a, b, c: the values of the same name in the Master's Theorem
    - example: 2, 3, 0.0
    - requirements: a >= 1 and b > 1 are ints, c >= 0 is a float
======
result
======
string: string representing a statement of the order of the function
        that is valid LaTeX syntax (in a given math-scope)
'''
def solve(a, b, c):
    result = {}

    if a < 1 or b <= 1 or c < 0:
        raise exceptions.CalculateError(f"Invalid inputs.")
    elif a < b ** c:
        if c == 1:
            result["Result"] = "S(n)=\\Theta(n)"
        elif c == 0:
            result["Result"] = "S(n)=\\Theta(1)"
        else:
            result["Result"] = f"S(n)=\\Theta(n^{{{c:.2f}}})"
    elif a == b ** c:
        if c == 1:
            result["Result"] = f"S(n)=\\Theta(n\\log{{n}})"
        elif c == 0:
            result["Result"] = f"S(n)=\\Theta(\\log{{n}})"
        else:
            result["Result"] = f"S(n)=\\Theta(n^{{{c:.2f}}}\\log{{n}})"
    else:
        d = math.log(a, b)
        if d == 1:
            result["Result"] = "S(n)=\\Theta(n)"
        elif d == 0:
            result["Result"] = "S(n)=\\Theta(1)"
        else:
            result["Result"] = f"S(n)=\\Theta(n^{{{d:.2f}}})"

    return json.dumps(result)
