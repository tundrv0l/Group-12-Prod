# File: disjoint_solver.py
# Author: Jacob Warren
# Solves: 5.4.56-5.4.59

from solvers import cycle_solver

import json

from .util import exceptions
from .util import strings

'''
==========
parameters
==========
cycle_strings: a list of strings representing the (possibly non-disjoint) cycle form
        of a permutation
    - example: ["(1 2)", "(2 3)"]
    - restrictions: whitespace is the delimiter of elements
======
result
======
disjoint_string: a string representing the disjoint cycle form
                 of the same permutation
'''

def convertStringToStrings(nonListedStrings):
    returnList = []
    iterateString = ""

    for index, char in enumerate(nonListedStrings):
        if char == ')': 
            iterateString += ")"
            iterateString = iterateString.strip()
            returnList.append(iterateString)
            iterateString = ""
        else:
            iterateString += char
    
    return returnList

def solve(cycle_strings):
    cycles = string_to_list(convertStringToStrings(cycle_strings))
    multi_mapping = {}
    cycle_count = 0
    
    # traverse cycles in composition order
    for cycle in reversed(cycles):
        # traverse current cycle
        for i in range(len(cycle)):
            # for any elements present, make a dictionary
            if cycle[i] not in multi_mapping:
                multi_mapping[cycle[i]] = {}

            # record what is mapped to and in what cycle 
            # example: A maps to B in cycle 2 = {A: {2: B, ...}, ...}
            multi_mapping[cycle[i]][cycle_count] = cycle[(i + 1) % len(cycle)]

        cycle_count = cycle_count + 1

    permutation = {}

    # create a dictionary representation of the permutation
    # represented by the cycles
    for element in multi_mapping:
        result = element

        # traverse through all cycles for each present element
        for i in range(0, cycle_count):
            # if the element was mapped in the current cycle,
            # update the result
            if i in multi_mapping[result]:
                result = multi_mapping[result][i]

        # example: 1->2->3 = {1: 3, ...}
        permutation[element] = result

    disjoint_string = cycle_solver.not_json(permutation)

    # disjoint_string = "(" + disjoint_string.replace("(", "").replace(")", "") + ")"

    result = {
        "Disjoint Cycle Form": disjoint_string
    }

    return json.dumps(result)

def string_to_list(cycle_strings):
    cycles = []

    for cycle_string in cycle_strings:
        cycle_string = cycle_string.strip("()").strip()
        cycle = cycle_string.split()
        cycles.append(cycle)

    return cycles


