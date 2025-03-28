# File: matrix_solver.py
# Author: Jacob Warren
# Solves: 5.7.47-5.7.50

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
A, B: 2D arrays representing m-by-n boolean matrices
    - example: [[1, 0]] and [[0, 1]] (1-by-2)
    - restrictions: matrix elements must be 1 or 0 and
                    the dimensions must be the same
======
result
======
conjunction: a 2D array representing their conjunction (m-by-n)
disjuction: a 2D array representing their disjunction (m-by-n)
'''
def solve(A, B):
    if len(A) != len(B) or len(A[0]) != len(B[0]):
        raise exceptions.CalculateError(f"Matrix dimensions don't match.")

    A, B = _preprocess_input(A, B)

    conjunction = [[0 for j in range(0, len(A[0]))] for i in range(0, len(A))]
    disjunction = [[0 for j in range(0, len(A[0]))] for i in range(0, len(A))]

    for i in range(0, len(A)):
        for j in range(0, len(A[0])):
            conjunction[i][j] += min(A[i][j], B[i][j])
            disjunction[i][j] += max(A[i][j], B[i][j])
    
    result = {
        "Join (Conjunction)": conjunction,
        "Meet (Disjunction)": disjunction
    }

    return json.dumps(result)


def _preprocess_input(A,B):
    A = [[int(j) for j in i] for i in A]
    B = [[int(j) for j in i] for i in B]
    return A, B

