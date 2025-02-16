# File: hasse_solver.py
# Author: Jacob Warren
# Solves: 5.1.31

import properties_solver

from util import methods
from util import strings

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
def solve(data):
    properties = properties_solver.solve(data)

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

    return hasse_string
