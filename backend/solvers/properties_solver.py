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
    properties, violations, set_list = something(set_string, relation_string)

    violation_strings = []
    for v in violations:
        violation_strings.append(strings.relation_to_string(set_list, v))

    # Return the result as json
    result = {
        "Reflexive": properties[0],
        "Irreflexive": properties[1],
        "Remove for Irrelexive": violation_strings[1],
        "Symmetric": properties[2],
        "Asymmetric": properties[3],
        "Remove for Asymmetric": violation_strings[3],
        "Antisymmetric": properties[4],
        "Remove for Antisymmetric": violation_strings[4],
        "Transitive": properties[5]
    }

    return json.dumps(result)

def something(set_string, relation_string):
    set_list, relation = strings.is_a_relation(set_string, relation_string)
    set_ = {i for i in range(0, len(set_list))}
    
    reflexive = True
    irreflexive = True
    symmetric = True
    asymmetric = True
    antisymmetric = True
    transitive = True

    violations = [set() for i in range(0, 6)]

    # check reflexive and irreflexive
    for a in set_:
        if (a,a) in relation:
            irreflexive = False
            violations[1].add((a,a))
        else:
            reflexive = False
            violations[0].add((a,a))

    # check asymmetric, antisymmetric, and symmetric
    for (a,b) in relation:
        if (b,a) in relation:
            asymmetric = False
            violations[3].add((b,a))
            if a != b:
                antisymmetric = False
                violations[4].add((b,a))
        else:
            symmetric = False
            violations[2].add((b,a))

    # check transitive
    for (a,b) in relation:
        for (c,d) in relation:
            if b == c and (a,d) not in relation:
                transitive = False
                violations[5].add((a,d))

    return [reflexive, irreflexive, symmetric, asymmetric, antisymmetric, transitive], violations, set_list

def not_string(set_string, relation_string):
    properties, violations, set_list = something(set_string, relation_string)

    return properties
