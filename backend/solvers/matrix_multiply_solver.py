# File: matrix_multiply_solver.py
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
A: 2D array representing a m-by-n boolean matrix
    - example: [[1, 0]] (1-by-2)
    -restrictions: matrix elements must be 1 or 0
B: 2D array representing a n-by-k boolean matrix
    - example [[0, 0], [1, 1]] (2-by-2)
    - restrictions: matrix elements must be 1 or 0
======
result
======
C: a 2D array representing their boolean multiplication (m-by-k)
'''
def solve(A, B):
    if len(A[0]) != len(B):
        raise exceptions.CalculateError(f"Bad dimensions.")
    
    A, B = _preprocess_input(A, B)

    C = [[0 for j in range(0, len(B[0]))] for i in range(0, len(A))]

    for i in range(0, len(A)):
        for j in range(0, len(B[0])):
            for k in range(0, len(A[0])):
                C[i][j] = max(min(A[i][k], B[k][j]), C[i][j])

    result = {
        "Product (A × B)": C
    }

    return json.dumps(result)

def _preprocess_input(A,B):
    A = [[int(j) for j in i] for i in A]
    B = [[int(j) for j in i] for i in B]
    return A, B
