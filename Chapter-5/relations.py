# File: relations.py
# Author: Jacob Warren
# Description: 5.1 stuff

import methods
import strings




# unit tests
def main():
    # test cases for relation properties and closures
    problems = [
        ("{1, 2, 3}", {0, 1, 2, 3}),          # 11/23
        ("{0, 1, 2, 4, 6}", {4, 5, 6, 7, 8}), # 12/24
        ("{}", {8})                           # edge case
    ]
    relations = [
        "{(1, 3), (3, 3), (3, 1), (2, 2), (2, 3), (1, 1), (1, 2)}",                 # 11.a/23.a
        "{(1, 1), (3, 3), (2, 2)}",                                                 # 11.b/23.b
        "{(1, 1), (1, 2), (2, 3), (3, 1), (1, 3)}",                                 # 11.c/23.c
        "{(1, 1), (1, 2), (2, 3), (1, 3)}",                                         # 11.d/23.d
        "{(0, 0), (1, 1), (2, 2), (4, 4), (6, 6), (0, 1), (1, 2), (2, 4), (4, 6)}", # 12.a/24.a
        "{(0, 1), (1, 0), (2, 4), (4, 2), (4, 6), (6, 4)}",                         # 12.b/24.b
        "{(0, 1), (1, 2), (0, 2), (2, 0), (2, 1), (1, 0), (0, 0), (1, 1), (2, 2)}", # 12.c/24.c
        "{(0, 0), (1, 1), (2, 2), (4, 4), (6, 6), (4, 6), (6, 4)}",                 # 12.d/24.d
        "{}"                                                                        # 12.e/24.e/edge case
    ]

    for (set_, indices) in problems:
        for i in indices:
            print(f"Properties {set_} {i}:", check_properties([set_, relations[i]]))

    for (set_, indices) in problems:
        for i in indices:
            print(f"Closures {set_} {i}:", closures([set_, relations[i]]))

    # test cases for Hasse diagram and special elements
    problems = [
        ("{a, b, c}", "{(a, a), (b, b), (c, c), (a, b), (b, c), (a, c)}"),    # 31.a/32.a
        ("{a, b, c, d}", "{(a, a), (b, b), (c, c), (d, d), (a, b), (a, c)}"), # 31.b/32.b
        # I think this set is invalid under our requirements                    31.c/32.c
        ("{}", "{}")                                                          # edge case
    ]

    for (set_, relation) in problems:
        print(f"Hasse Diagram {problems.index((set_, relation))}:", hasse_diagram([set_, relation]))

    for (set_, relation) in problems:
        print(f"Special Elements {problems.index((set_, relation))}:", special_elements([set_, relation]))

    # test cases for partitions -> equivalence relations
    problems = [
        ("{1, 2, 3, 4}", "{{1, 2}, {3, 4}}"),       # 51.a
        ("{a, b, c, d, e}", "{{a, b, c}, {d, e}}"), # 51.b
        ("{}", "{}")                                # edge case
    ]

    for (set_, partition) in problems:
        print(f"Equivalence Relation {problems.index((set_, partition))}:", equivalence_relation([set_, partition]))

if __name__ == "__main__":
    main()
