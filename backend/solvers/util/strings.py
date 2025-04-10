# File: strings.py
# Author: Jacob Warren
# Description: Chapter 5 string parsing stuff

from . import exceptions

def parse_set(set_string):
    set_string_ = set_string.strip()
    set_string_ = set_string_[1:-1]
    elements = []
    element_string = ''
    open_stack = []

    for char in set_string_:
        if char == ',' and not open_stack:
            element_string = element_string.strip()

            if element_string and element_string not in elements:
                elements.append(element_string)

            element_string = ''
        else:
            element_string += char

            if char in '{[(':
                open_stack.append(char)
            elif char in ')]}':
                if not open_stack:
                    raise exceptions.CalculateError(f"Too many closing chars: ", char)

                last_open = open_stack.pop()

                if (
                    last_open == '{' and char != '}' or
                    last_open == '[' and char != ']' or
                    last_open == '(' and char != ')'
                ):
                    raise exceptions.CalculateError("Mismatched ", last_open, " with ", char)

    if open_stack:
        raise exceptions.CalculateError(f"Too many opening chars: ", open_stack)

    element_string = element_string.strip()

    if element_string and element_string not in elements:
        elements.append(element_string)

    return elements

def parse_tuple(tuple_string):
    tuple_string_ = tuple_string.strip()
    tuple_string_ = tuple_string_[1:-1]
    elements = []
    element_string = ''
    open_stack = []

    for char in tuple_string_:
        if char == ',' and not open_stack:
            element_string = element_string.strip()

            if element_string:
                elements.append(element_string)
                element_string = ''
        else:
            element_string += char

            if char in '{[(':
                open_stack.append(char)
            elif char in ')]}':
                if not open_stack:
                    raise exceptions.CalculateError(f"Too many closing chars: ", char)

                last_open = open_stack.pop()

                if (
                    last_open == '{' and char != '}' or
                    last_open == '[' and char != ']' or
                    last_open == '(' and char != ')'
                ):
                    raise exceptions.CalculateError("Mismatched ", last_open, " with ", char)

    if open_stack:
        raise exceptions.CalculateError(f"Too many opening chars: ", open_stack)

    element_string = element_string.strip()

    if element_string:
        elements.append(element_string)

    return elements

def is_a_relation(set_string, relation_string):
    set_list = parse_set(set_string)
    relation_list = parse_set(relation_string)
    relation = set()

    for pair_string in relation_list:
        pair = parse_tuple(pair_string)

        try:
            relation.add((set_list.index(pair[0]), set_list.index(pair[1])))
        except ValueError:
            raise exceptions.CalculateError(f"Pair {pair} has elements outside of the provided set.")

    return set_list, relation

def relation_to_string(set_list, relation):
    relation_string = "{"

    for (a,b) in relation:
        relation_string += f"({set_list[a]}, {set_list[b]}), "

    if relation:
        relation_string = relation_string[:-2]
    
    relation_string += "}"

    return relation_string
