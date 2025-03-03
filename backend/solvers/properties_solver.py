# File: properties_solver.py
# Author: Jacob Warren
# Solves: 5.1.11 and 5.1.12

import sys
import os
import json

# Do some funky appendin' to get the parent directory on the path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from solvers.util import strings

'''
==========
parameters
==========
set_string: a string containing the inputted set
    - example: "{a, b, c, 23}" 
    - restrictions: if the element has commas in it, it must either be a set, a tuple, or 
                    a list
relation_string: a string containing the inputted relation
    - example: "{(a, b), (23, c)}"
    - restrictions: the elements must all be pairs, and the elements in the pairs must come 
                    from the set
======
result
======
bool[6]: a list of bools representing the respective properties
                                      of the relation on the set
'''
def solve(set_string, relation_string):
    result_list = not_string(set_string, relation_string)

    # Return the result as json
    result = {
        "Reflexive": result_list[0],
        "Irreflexive": result_list[1],
        "Symmetric": result_list[2],
        "Asymmetric": result_list[3],
        "Antisymmetric": result_list[4],
        "Transitive": result_list[5]
    }

    return json.dumps(result)

def not_string(set_string, relation_string):
    set_list, relation = strings.is_a_relation(set_string, relation_string)
    set_ = {i for i in range(0, len(set_list))}
    
    reflexive = True
    irreflexive = True
    symmetric = True
    asymmetric = True
    antisymmetric = True
    transitive = True

    # check reflexive and irreflexive
    for element in set_:
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
