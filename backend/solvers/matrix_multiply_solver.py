# File: matrix_multiply_solver.py
# Author: Jacob Warren
# Solves: 5.7.47-5.7.50

import json

from util import exceptions

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

    C = [[0 for j in range(0, len(B[0]))] for i in range(0, len(A))]

    for i in range(0, len(A)):
        for j in range(0, len(B[0])):
            for k in range(0, len(A[0])):
                C[i][j] += min(A[i][k], B[k][j])

    result = {
        "A × B": C
    }

    return json.dumps(result)


