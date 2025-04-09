# File: closures_solver.py
# Author: Jacob Warren
# Solves: 5.1.23 and 5.1.24

import os
import sys
import json

# Append the parent directory to the path so we can import in utility
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from solvers.util import methods
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
reflexive_string: a string representing the added elements of the reflexive
                  closure
symmetric_string: a string representing the added elements of the symmetric
                  closure
transitive_string: a string representing the added elements of the transitive
                  closure
'''
def solve(set_string, relation_string):
    set_list, relation = strings.is_a_relation(set_string, relation_string)
    set_ = {i for i in range(0, len(set_list))}

    reflexive_diff = methods.reflexive_closure(set_, relation) - relation
    symmetric_diff = methods.symmetric_closure(relation) - relation
    transitive_diff = methods.transitive_closure(relation) - relation

    reflexive_string = strings.relation_to_string(set_list, reflexive_diff)
    symmetric_string = strings.relation_to_string(set_list, symmetric_diff)
    transitive_string = strings.relation_to_string(set_list, transitive_diff)

    # Return the result as json
    result = {
        "Reflexive Closure": reflexive_string,
        "Symmetric Closure": symmetric_string,
        "Transitive Closure": transitive_string,
    }

    return json.dumps(result)
