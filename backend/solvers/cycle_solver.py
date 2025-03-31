# File: cycle_solver.py
# Author: Jacob Warren
# Solves: 5.4.53

import json

from .util import exceptions
from .util import strings

'''
==========
parameters
==========
permutation: a dictionary representing a permutation
    - example: {"A": "2", "2": "A"} 
    - restrictions: it has to be a bijection from some set
                    to itself
======
result
======
cycles_string: a string representing the cycle form
               representation of the permutation
'''

def convertToDictioary(permutationMatrix):
    dictionary = {}
    for i in range(permutationMatrix[0].__len__()):
        dictionary[permutationMatrix[0][i]] = permutationMatrix[1][i]
    return dictionary

def solve(permutation):
    cycles_string = not_json(convertToDictioary(permutation))

    result = {
        "Cycle Form": cycles_string
    }

    return json.dumps(result)

def not_json(permutation):
    inputs = {key for key in permutation.keys()}
    outputs = {value for value in permutation.values()}

    if inputs != outputs:
        raise exceptions.CalculateError(f"Not a permutation.")

    visited = set()
    cycles = []

    # chop the permutation into cycles
    for element in permutation:
        # start next cycle
        if element not in visited:
            cycle = []
            current = element
            
            # create the current cycle
            while current not in visited:
                visited.add(current)
                cycle.append(current)
                current = permutation[current]
            
            # add cycle to the composition
            if len(cycle) > 1:
                # put the lowest element first in cycle
                min_element = min(cycle)
                min_index = cycle.index(min_element)
                normalized_cycle = cycle[min_index:] + cycle[:min_index]
                cycles.append(tuple(normalized_cycle))

    # sort the cycles by the lowest first element in the cycle
    # (they are disjoint, so composition is commutative)
    cycles.sort(key=lambda x: x[0])

    cycles_string = ""

    for cycle in cycles:
        cycles_string += "("

        for element in cycle:
            cycles_string += f"{element} "

        cycles_string = cycles_string[:-1]

        cycles_string += ")∘"

    if cycles:
        cycles_string = cycles_string[:-1]
    
    return cycles_string
