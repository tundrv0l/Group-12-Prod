# File: 5_2_test.py
# Author: Jacob Warren
# Description: test 5.2 stuff

import sys, os

# ew
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'solvers'))

import table_solver
import topological_solver
import critical_solver

def main():
    tables = [
        { # 3/5/11
            "A": ({"E"}, 3),
            "B": ({"C", "D"}, 5),
            "C": ({"A"}, 2),
            "D": ({"A"}, 6),
            "E": (set(), 2),
            "F": ({"A", "G"}, 4),
            "G": ({"E"}, 4),
            "H": ({"B", "F"}, 1)
        },
        { # 4/6/12
            1: ({2}, 4),
            2: ({3}, 2),
            3: ({8}, 5),
            4: ({3}, 2),
            5: ({4, 7}, 2),
            6: ({5}, 1),
            7: ({3}, 3),
            8: (set(), 5)
        },
        {}, # edge case
        { # 9
            "A": ({"F"}, 0),
            "B": ({"A", "C"}, 0),
            "C": ({"F"}, 0),
            "D": ({"F"}, 0),
            "E": ({"D"}, 0),
            "F": ({"G", "H"}, 0),
            "G": (set(), 0),
            "H": (set(), 0)
        },
        { # 10
            "A": (set(), 0),
            "B": ({"A"}, 0),
            "C": ({"A"}, 0),
            "D": ({"B", "E"}, 0),
            "E": ({"C"}, 0),
            "F": ({"C"}, 0),
            "G": ({"F"}, 0)
        },
        { # 13
            1: ({9}, 0),
            2: ({11}, 0),
            3: ({11}, 0),
            4: ({10}, 0),
            5: ({2, 3}, 0),
            6: (set(), 0),
            7: ({9}, 0),
            8: ({9}, 0),
            9: ({6}, 0),
            10: ({1, 7, 8, 11}, 0),
            11: (set(), 0)
        },
        { # 14
            1: ({2, 3, 7}, 0),
            2: (set(), 0),
            3: (set(), 0),
            4: ({1, 3, 9}, 0),
            5: (set(), 0),
            6: ({2, 3, 7}, 0),
            7: (set(), 0),
            8: ({1, 4, 6}, 0),
            9: ({5}, 0)
        }
    ]

    for i in range (0, 3):
        print(f"Critical path {i}: ", critical_solver.solve(tables[i]))

    for i in range (0, len(tables)):
        print(f"Total order {i}: ", topological_solver.solve(tables[i]))

    for i in range (0, len(tables)):
        table_solver.solve(tables[i])

if __name__ == "__main__":
    main()
