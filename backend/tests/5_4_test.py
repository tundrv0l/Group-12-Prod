# File: 5_2_test.py
# Author: Jacob Warren
# Description: test 5.4 stuff

import sys, os

# ew
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'solvers'))

import cycle_solver
import disjoint_solver

def main():
    # test cases for permutation -> cycle form
    permutations = [
        {1: 3, 2: 1, 3: 5, 4: 4, 5: 2}, # 53.a
        {1: 4, 2: 5, 3: 2, 4: 3, 5: 1}, # 53.b
        {}                              # edge case
    ]

    for i in range(0, len(permutations)):
        print(f"Cycle form {i}:", cycle_solver.solve(permutations[i]))

    # test cases for cycle form -> disjoint cycle form
    cycle_forms = [
        ["(2 4 5 3)", "(1 3)"],                                                              # 56.a
        ["(3 5 2)", "(2 1 3)", "(4 1)"],                                                      # 56.b
        ["(2 4)", "(1 2 5)", "(2 3 1)", "(5 2)"],                                              # 56.c
        ["(1 3 4)", "(5 1 2)"],                                                              # 57.a
        ["(2 7 8)", "(1 2 4 6 8)"],                                                        # 57.b
        ["(1 3 4)", "(5 6)", "(2 3 5)", "(6 1)"],                                              # 57.c
        ["(2 7 1 3)", "(2 8 7 5)", "(4 2 1 8)"],                                          # 57.d
        ["(3 5 2)", "(6 2 4 1)", "(4 8 6 2)"],                                             # 58.a
        ["(1 5 13 2 6)", "(3 6 4 13)", "(13 2 6 1)"],                                    # 58.b
        ["(1 2)", "(1 3)", "(1 4)", "(1 5)"],                                                    # 58.c
        ["(a d c e)", "(d c b)", "(e c a d)", "(a c b d)"], # 59.a
        ["(e b a)", "(b e d)", "(d a)"],                                      # 59.b
        ["(b e d)", "(d a)", "(e a c)", "(a c b e)"],                # 59.c
        []                                                                                   # edge case
    ]

    for i in range(0, len(cycle_forms)):
        print(f"Disjoint form {i}:", disjoint_solver.solve(cycle_forms[i]))

if __name__ == "__main__":
    main()
