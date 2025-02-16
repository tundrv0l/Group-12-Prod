# File: properties_solver.py
# Author: Jacob Warren
# Solves: 5.1.11 and 5.1.12

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
[bool, bool, bool, bool, bool, bool]: a list of bools representing the respective properties
                                      of the relation on the set
'''
def solve(data):
    set_list, relation = strings.is_a_relation(data[0], data[1])
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
