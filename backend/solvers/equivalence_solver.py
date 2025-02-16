# File: equivalence_solver.py
# Author: Jacob Warren
# Solves: 5.1.51

from util import strings

'''
==========
parameters
==========
data[0]: a string containing the inputted set
    - example: "{a, b, c, 23}" 
    - restrictions: if the element has commas in it, it must either be a set, a tuple, or 
                    a list
data[1]: a string containing the inputted partition
    - example: "{{a, b}, {c, 23}}"
    - restrictions: the elements must all be sets, the elements of each element must be
                    in data[0], and the union of all elements must be equal to
                    the data[0]
======
result
======
[string, string, string, string]: a list of strings representing the respective special
                                  elements and sets of elements
'''
def solve(data):
    set_list = strings.parse_set(data[0])
    partition_list = strings.parse_set(data[1])
    set_ = {i for i in range(0, len(set_list))}
    partition = []
    
    for piece_string in partition_list:
        piece_string = strings.parse_set(piece_string)
        piece = set()

        for a in piece_string:
            try:
                piece.add(set_list.index(a))
            except ValueError:
                raise ValueError(f"Element {a} is not in the set.")
        
        partition.append(piece)

    relation_string = "{"
    collection = set()

    for piece in partition:
        collection |= piece

        for a in piece:
            for b in piece:
                relation_string += f"({set_list[a]}, {set_list[b]}), "

    if collection != set_:
        raise ValueError(f"Partition is missing elements.")

    relation_string += "}"

    if relation_string != "{}":
        relation_string = relation_string[:-2]

    return relation_string
