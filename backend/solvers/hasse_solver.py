# File: hasse_solver.py
# Author: Jacob Warren
# Solves: 5.1.31

import os
import sys
import json

# Append the parent directory to the path so we can import in utility
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from solvers.util import strings
from solvers.util import methods
from solvers.properties_solver import solve as properties_solver

'''
==========
parameters
==========
data[0]: a string containing the inputted set
    - example: "{a, b}" 
    - restrictions: if the element has commas in it, it must either be a set, a tuple, or 
                    a list
data[1]: a string containing the inputted relation
    - example: "{(a, a), (b, b)}"
    - restrictions: the elements must all be pairs, the elements in the pairs must come 
                    from data[0], and the relation must be a partial order
======
result
======
string: a string representing the filtered relation that can be used to generate
        a Hasse diagram directly
'''
def solve(set, relation):

    # TODO: Fix for Jacob
    _, properties = properties_solver(set, relation)

    data = [set, relation]

    if not properties[0] or not properties[4] or not properties[5]:
        raise ValueError(f"Not a partial order.")

    set_list, relation = strings.is_a_relation(data[0], data[1])
    set_ = {i for i in range(0, len(set_list))}
    
    relation = relation - methods.reflexive_filter(set_, relation)
    relation = relation - methods.transitive_filter(set_, relation)

    hasse_string = "{"

    for pair in relation:
        hasse_string += f"({set_list[pair[0]]}, {set_list[pair[1]]}), "

    if relation:
        hasse_string = hasse_string[:-2]

    hasse_string += "}"
    print(hasse_string)
    result = { 
        "Hasse Diagram": hasse_string 
        }

    return json.dumps(result)
