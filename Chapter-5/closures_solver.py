# File: closures_solver.py
# Author: Jacob Warren
# Solves: 5.1.23 and 5.1.24

import methods
import strings

'''
==========
parameters
==========
data[0]: a string containing the inputted set
    - example: "{a, b, c, 23}" 
    - restrictions: if the element has commas in it, it must either be a set, a tuple, or 
                    a list
data[1]: a string containing the inputted relation
    - example: "{(a, b), (23, c)}"
    - restrictions: the elements must all be pairs, and the elements in the pairs must come 
                    from data[0]
======
result
======
[string, string, string]: a list of strings representing the respective closure
                          additions as relations
'''
def solve(data):
    set_list, relation = strings.is_a_relation(data[0], data[1])
    set_ = {i for i in range(0, len(set_list))}

    reflexive_diff = methods.reflexive_closure(set_, relation) - relation
    symmetric_diff = methods.symmetric_closure(relation) - relation
    transitive_diff = methods.transitive_closure(relation) - relation

    reflexive_string = "{"
    symmetric_string = "{"
    transitive_string = "{"

    for pair in reflexive_diff:
        reflexive_string += f"({set_list[pair[0]]}, {set_list[pair[1]]}), "

    for pair in symmetric_diff:
        symmetric_string += f"({set_list[pair[0]]}, {set_list[pair[1]]}), "

    for pair in transitive_diff:
        transitive_string += f"({set_list[pair[0]]}, {set_list[pair[1]]}), "

    if reflexive_diff:
        reflexive_string = reflexive_string[:-2]

    if symmetric_diff:
        symmetric_string = symmetric_string[:-2]

    if transitive_diff:
        transitive_string = transitive_string[:-2]
    
    reflexive_string += "}"
    symmetric_string += "}"
    transitive_string += "}"

    return [reflexive_string, symmetric_string, transitive_string]
