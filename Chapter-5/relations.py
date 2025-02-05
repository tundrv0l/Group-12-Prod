# File: relations.py
# Author: Jacob Warren
# Description: 5.1 stuff

import methods

# Function: check_properties
# Input: a set in the form of a set and a relation on that set
#        in the form of a set of tuples
# Output: a list containing a boolean for each relation property
#         indicating whether it the inputted relation
#         has that property relative to the inputted
#         set
# Purpose: solve problems like 11 and 12
def check_properties(elements, relation):
    reflexive = True
    irreflexive = True
    symmetric = True
    asymmetric = True
    antisymmetric = True
    transitive = True

    # check reflexive and irreflexive
    for element in elements:
        if (element, element) in relation:
            irreflexive = False
        else:
            reflexive = False

    # check asymmetric, antisymmetric, and symmetric
    for (a, b) in relation:
        if (b, a) in relation:
            asymmetric = False
            
            if a != b:
                antisymmetric = False
        else:
            symmetric = False

    # check transitive
    for (a, b) in relation:
        for (c, d) in relation:
            if b == c and (a,d) not in relation:
                transitive = False

    return [reflexive, irreflexive, symmetric, asymmetric, antisymmetric, transitive]

# Function: closures
# Input: a set in the form of a set and a relation on that set
#        in the form of a set of tuples
# Output: a list containing relations in the form of sets of tuples
#         for each closure-defference on that set and relation
# Purpose: solve problems like 23 and 24
def closures(elements, relation):
    return [methods.reflexive_closure(elements, relation) - relation, methods.symmetric_closure(relation) - relation, methods.transitive_closure(relation) - relation]

# Function: hasse_diagram
# Input: a set in the form of a set and a partial order on that set
#        in the form of a set of tuples
# Output: a filtered relation in the form of a list of tuples
#         that can be used to visualize a Hasse diagram
# Purpose: solve problems like 31
def hasse_diagram(elements, relation):
    # remove implied arrows
    return (set(relation) - methods.reflexive_filter(elements, relation)) - methods.transitive_filter(elements, relation)

# Function: special_elements
# Input: a set in the form of a set and a partial order on that set
#        in the form of a set of tuples
# Output: a list containing each special element
# Purpose: solve problems like 32
def special_elements(elements, relation):
    least = methods.least_element(elements, relation)
    greatest = methods.greatest_element(elements, relation)
    minimals = set()
    maximals = set()

    # the existance of least or greatest elements implied there is only one
    # minimal or maximal element respectively
    if least:
        minimals = {least}
    else:
        minimals = methods.minimal_elements(elements, relation)

    if greatest:
        maximals = {greatest}
    else:
        maximals = methods.maximal_elements(elements, relation)

    return [least, greatest, minimals, maximals]

# Function: equivalence_relation
# Input: a set in the form of a set and a partition in the form
#        of a list of sets
# Output: a relation representing that partition in the form of 
#         a set of tuples
# Purpose: solve problems like 51
def equivalence_relation(elements, partition):
    relation = set()

    for piece in partition:
        for a in piece:
            for b in piece:
                relation.add((a, b))

    return relation

# unit tests
def main():
    # test cases for relation properties and closures
    problems = [
        ({1, 2, 3}, {0, 1, 2, 3}),          # 11/23
        ({0, 1, 2, 4, 6}, {4, 5, 6, 7, 8}), # 12/24
        (set(), {8})                        # edge case
    ]
    relations = [
        {(1, 3), (3, 3), (3, 1), (2, 2), (2, 3), (1, 1), (1, 2)},                 # 11.a/23.a
        {(1, 1), (3, 3), (2, 2)},                                                 # 11.b/23.b
        {(1, 1), (1, 2), (2, 3), (3, 1), (1, 3)},                                 # 11.c/23.c
        {(1, 1), (1, 2), (2, 3), (1, 3)},                                         # 11.d/23.d
        {(0, 0), (1, 1), (2, 2), (4, 4), (6, 6), (0, 1), (1, 2), (2, 4), (4, 6)}, # 12.a/24.a
        {(0, 1), (1, 0), (2, 4), (4, 2), (4, 6), (6, 4)},                         # 12.b/24.b
        {(0, 1), (1, 2), (0, 2), (2, 0), (2, 1), (1, 0), (0, 0), (1, 1), (2, 2)}, # 12.c/24.c
        {(0, 0), (1, 1), (2, 2), (4, 4), (6, 6), (4, 6), (6, 4)},                 # 12.d/24.d
        set()                                                                     # 12.e/24.e
    ]

    for (elements, indices) in problems:
        for i in indices:
            print(f"Properties {elements} {i}:", check_properties(elements, relations[i]))

    for (elements, indices) in problems:
        for i in indices:
            print(f"Closures {elements} {i}:", closures(elements, relations[i]))

    # test cases for Hasse diagram and special elements
    problems = [
        ({'a', 'b', 'c'}, {('a', 'a'), ('b', 'b'), ('c', 'c'), ('a', 'b'), ('b', 'c'), ('a', 'c')}),      # 31.a/32.a
        ({'a', 'b', 'c', 'd'}, {('a', 'a'), ('b', 'b'), ('c', 'c'), ('d', 'd'), ('a', 'b'), ('a', 'c')}), # 31.b/32.b
        # I think this set is invalid under our requirements                                                31.c/32.c
        ({}, {})                                                                                          # edge case
    ]

    for (elements, relation) in problems:
        print(f"Hasse Diagram {problems.index((elements, relation))}:", hasse_diagram(elements, relation))

    for (elements, relation) in problems:
        print(f"Special Elements {problems.index((elements, relation))}:", special_elements(elements, relation))

    # test cases for partitions -> equivalence relations
    problems = [
        ({1, 2, 3, 4}, [{1, 2}, {3, 4}]),                           # 51.a
        ({'a', 'b', 'c', 'd', 'e'}, [{'a', 'b', 'c'}, {'d', 'e'}]), # 51.b
        ({}, {})                                                    # edge case
    ]

    for (elements, partition) in problems:
        print(f"Equivalence Relation {problems.index((elements, partition))}:", equivalence_relation(elements, partition))

if __name__ == "__main__":
    main()