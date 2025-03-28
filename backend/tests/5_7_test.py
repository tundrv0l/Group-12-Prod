# File: 5_7_test.py
# Author: Jacob Warren
# Description: test 5.7 stuff

import sys, os

# ew
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'solvers'))

import matrix_solver
import matrix_multiply_solver

def main():
    matrices = [
        ( # 47
            [
                [1, 0, 0],
                [1, 1, 0],
                [0, 1, 1]
            ],
            [
                [1, 0, 1],
                [0, 1, 1],
                [1, 1, 1]
            ]
        ),
        ( # 48
            [
                [0, 0, 1],
                [1, 1, 0],
                [1, 0, 0]
            ],
            [
                [0, 1, 1],
                [0, 0, 0],
                [1, 0, 0]
            ]
        ),
        ( # 49
            [
                [0, 1, 0],
                [1, 0, 1],
                [0, 0, 1]
            ],
            [
                [0, 1, 1],
                [0, 0, 1],
                [1, 0, 0]
            ]
        ),
        ( # 50
            [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 1]
            ],
            [
                [1, 0, 1],
                [0, 1, 1],
                [1, 1, 1]
            ]
        ),
        ( # edge case
            [[0]],
            [[0]]
        )
    ]

    for i in range(len(matrices)):
        print(f"{i}: ", matrix_solver.solve(matrices[i][0], matrices[i][1]))
        print(f"{i}: ", matrix_multiply_solver.solve(matrices[i][0], matrices[i][1]))

if __name__ == "__main__":
    main()
