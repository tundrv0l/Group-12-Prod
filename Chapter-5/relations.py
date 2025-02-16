# File: relations.py
# Author: Jacob Warren
# Description: 5.1 stuff

import methods
import strings

# Function: closures
# Input: a string containing a valid set and
#        a string containing a valid relation
# Output: a list containing relations in the form of sets of tuples
#         for each closure-defference on that set and relation
# Purpose: solve problems like 23 and 24
def closures(data):
    set_list, relation = is_a_relation(data[0], data[1])
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

# Function: hasse_diagram
# Input: a string containing a valid set and
#        a string containing a valid partial order
# Output: a filtered relation in the form of a list of tuples
#         that can be used to visualize a Hasse diagram
# Purpose: solve problems like 31
def hasse_diagram(data):
    properties = check_properties(data)

    if not properties[0] or not properties[4] or not properties[5]:
        raise ValueError(f"Not a partial order.")

    set_list, relation = is_a_relation(data[0], data[1])
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

# Function: special_elements
# Input: a string containing a valid set and
#        a string containing a valid partial order
# Output: a list containing strings of each special 
#         element or special element collection
# Purpose: solve problems like 32
def special_elements(data):
    properties = check_properties(data)

    if not properties[0] or not properties[4] or not properties[5]:
        raise ValueError(f"Not a partial order.")

    set_list, relation = is_a_relation(data[0], data[1])
    set_ = {i for i in range(0, len(set_list))}

    least = methods.least_element(set_, relation)
    greatest = methods.greatest_element(set_, relation)
    minimals = set()
    maximals = set()
    
    least_string = ""
    greatest_string = ""
    minimals_string = "{"
    maximals_string = "{"

    # the existance of least or greatest elements implied there is only one
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

    return [least_string, greatest_string, minimals_string, maximals_string]

# Function: equivalence_relation
# Input: a string representing a valid set
#        a string representing a valid partition
#        on that set
# Output: a relation representing that partition in the form of 
#         a set of tuples
# Purpose: solve problems like 51
def equivalence_relation(data):
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

# unit tests
def main():
    # test cases for relation properties and closures
    problems = [
        ("{1, 2, 3}", {0, 1, 2, 3}),          # 11/23
        ("{0, 1, 2, 4, 6}", {4, 5, 6, 7, 8}), # 12/24
        ("{}", {8})                           # edge case
    ]
    relations = [
        "{(1, 3), (3, 3), (3, 1), (2, 2), (2, 3), (1, 1), (1, 2)}",                 # 11.a/23.a
        "{(1, 1), (3, 3), (2, 2)}",                                                 # 11.b/23.b
        "{(1, 1), (1, 2), (2, 3), (3, 1), (1, 3)}",                                 # 11.c/23.c
        "{(1, 1), (1, 2), (2, 3), (1, 3)}",                                         # 11.d/23.d
        "{(0, 0), (1, 1), (2, 2), (4, 4), (6, 6), (0, 1), (1, 2), (2, 4), (4, 6)}", # 12.a/24.a
        "{(0, 1), (1, 0), (2, 4), (4, 2), (4, 6), (6, 4)}",                         # 12.b/24.b
        "{(0, 1), (1, 2), (0, 2), (2, 0), (2, 1), (1, 0), (0, 0), (1, 1), (2, 2)}", # 12.c/24.c
        "{(0, 0), (1, 1), (2, 2), (4, 4), (6, 6), (4, 6), (6, 4)}",                 # 12.d/24.d
        "{}"                                                                        # 12.e/24.e/edge case
    ]

    for (set_, indices) in problems:
        for i in indices:
            print(f"Properties {set_} {i}:", check_properties([set_, relations[i]]))

    for (set_, indices) in problems:
        for i in indices:
            print(f"Closures {set_} {i}:", closures([set_, relations[i]]))

    # test cases for Hasse diagram and special elements
    problems = [
        ("{a, b, c}", "{(a, a), (b, b), (c, c), (a, b), (b, c), (a, c)}"),    # 31.a/32.a
        ("{a, b, c, d}", "{(a, a), (b, b), (c, c), (d, d), (a, b), (a, c)}"), # 31.b/32.b
        # I think this set is invalid under our requirements                    31.c/32.c
        ("{}", "{}")                                                          # edge case
    ]

    for (set_, relation) in problems:
        print(f"Hasse Diagram {problems.index((set_, relation))}:", hasse_diagram([set_, relation]))

    for (set_, relation) in problems:
        print(f"Special Elements {problems.index((set_, relation))}:", special_elements([set_, relation]))

    # test cases for partitions -> equivalence relations
    problems = [
        ("{1, 2, 3, 4}", "{{1, 2}, {3, 4}}"),       # 51.a
        ("{a, b, c, d, e}", "{{a, b, c}, {d, e}}"), # 51.b
        ("{}", "{}")                                # edge case
    ]

    for (set_, partition) in problems:
        print(f"Equivalence Relation {problems.index((set_, partition))}:", equivalence_relation([set_, partition]))

if __name__ == "__main__":
    main()
