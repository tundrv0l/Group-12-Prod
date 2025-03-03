# File: matrix_solver.py
# Author: Jacob Warren
# Solves: 5.7.47-5.7.50

import json

from util import exceptions

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

    conjunction = [[0 for j in range(0, len(A[0]))] for i in range(0, len(A))]
    disjunction = [[0 for j in range(0, len(A[0]))] for i in range(0, len(A))]

    for i in range(0, len(A)):
        for j in range(0, len(A[0])):
            conjunction[i][j] += min(A[i][j], B[i][j])
            disjunction[i][j] += max(A[i][j], B[i][j])
    
    result = {
        "A ∧ B": conjunction,
        "A ∨ B": disjunction
    }

    return json.dumps(result)


