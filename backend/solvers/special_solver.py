# File: special_solver.py
# Author: Jacob Warren
# Solves: 5.1.32
import os
import sys
import json



# Append the parent directory to the path so we can import in utility
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from solvers.util import strings
from solvers.util import methods
from solvers.util import exceptions
from solvers import properties_solver

'''
==========
parameters
==========
set_string: a string containing the inputted set
    - example: "{a, b}" 
    - restrictions: if the element has commas in it, it must either be a set, a tuple, or 
                    a list
relation: a string containing the inputted relation
    - example: "{(a, a), (b, b)}"
    - restrictions: the elements must all be pairs, the elements in the pairs must come 
                    from the set, and the relation must be a partial order
======
result
======
least_string: a string representing the least element in the partial order (if it exists)
greatest_string: a string representing the greatest element in the partial order (if it   
                 exists)
minimals_string: a string representing the set of all minimal elements in the partial
                 order
maximals_string: a string representing the set of all maximal elements in the partial
                 order
'''
def solve(set_string, relation_string):
    properties = properties_solver.not_string(set_string, relation_string)

    if not properties[0] or not properties[4] or not properties[5]:
        raise exceptions.CalculateError(f"Not a partial order.")

    set_list, relation = strings.is_a_relation(set_string, relation_string)
    set_ = {i for i in range(0, len(set_list))}

    least = methods.least_element(set_, relation)
    greatest = methods.greatest_element(set_, relation)
    minimals = set()
    maximals = set()
    
    least_string = ""
    greatest_string = ""
    minimals_string = "{"
    maximals_string = "{"

    # the existance of least or greatest elements implies there is only one
    # minimal or maximal element respectively
    if least != None:
        minimals = {least}
        least_string = set_list[least]
        minimals_string += least_string
    else:
        minimals = methods.minimal_elements(set_, relation)

        for m in minimals:
            minimals_string += set_list[m]
            minimals_string += ", "

        if minimals:
            minimals_string = minimals_string[:-2]

    minimals_string += "}"

    if greatest != None:
        maximals = {greatest}
        greatest_string = set_list[greatest]
        maximals_string += greatest_string
    else:
        maximals = methods.maximal_elements(set_, relation)

        for m in maximals:
            maximals_string += set_list[m]
            maximals_string += ", "

        if maximals:
            maximals_string = maximals_string[:-2]

    maximals_string += "}"

    if not least_string:
        least_string = "N/A"
    if not greatest_string:
        greatest_string = "N/A"

    # Convert the response to json
    result = {
        "Least Element": least_string,
        "Greatest Element": greatest_string,
        "Minimal Element": minimals_string,
        "Maximal Element": maximals_string
    }

    return json.dumps(result)
