# File: 5_5_test.py
# Author: Jacob Warren
# Description: test 5.5 stuff

import sys, os

# ew
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'solvers'))

import master_solver
import order_solver

def main():
    problems = [
        (1, [0, 1], [1, 17]),               # 1
        (3, [0, -7, 0, 3], [0, 0, 0, 1/2]), # 2
        (2, [-15, -4, 29], [0, 1, 15]),     # 3
        (0, [0], [0]),                      # edge case
    ]

    for i in range(len(problems)):
        print(f"Constants {i}: ", order_solver.solve(problems[i][0], problems[i][1], problems[i][2]))

    expressions = [
        (2, 4, 2),   # 21
        (4, 3, 1),   # 22
        (4, 4, 1),   # 23
        (4, 2, 2),   # 24
        (3, 3, 1/2), # 25
        (2, 2, 3),   # 26
        (1, 2, 0)    # edge case
    ]

    for i in range(len(expressions)):
        print(f"Master Theorem {i}: ", master_solver.solve(expressions[i][0], expressions[i][1], expressions[i][2]))

if __name__ == "__main__":
    main()
