# File: methods.py
# Author: Jacob Warren
# Description: Chapter 5 helper functions

import copy

# return a reflexive relation extending the inputted one
def reflexive_closure(elements, relation):
    closure = copy.deepcopy(relation)

    for a in elements:
        closure.add((a, a))

    return closure

# return a symmetric relation extending the inputted one
def symmetric_closure(relation):
    closure = copy.deepcopy(relation)

    for (a, b) in relation:
        closure.add((b, a))

    return closure

# return a transitive relation extending the inputted one
def transitive_closure(relation):
    closure = copy.deepcopy(relation)

    for (a, b) in relation:
        for (c, d) in relation:
                if b == c:
                    closure.add((a, d))

    return closure

# remove all pairs implied by transitivity (can only be called after reflexive_filter)
def transitive_filter(elements, relation):
    remove = set()

    for (a, b) in relation:
        for (c, d) in relation:
            if b == c:
                remove.add((a, d))

    for a in remove:
        relation.remove(a)

# remove all pairs implied by reflexitivity 
def reflexive_filter(elements, relation):
    for a in elements:
        relation.remove((a,a))
    
# if it exists, return the least element of a partially ordered set
def least_element(elements, relation):
    for a in elements:
        for b in elements:
            if (a, b) not in relation:
                break
        else:
            return a

    return None

# if it exists, return the greatest element of a partially ordered set
def greatest_element(elements, relation):
    for a in elements:
        for b in elements:
            if (b,a) not in relation:
                break
        else:
            return a

    return None

# return a set of all manimal elements of a partially ordered set
def minimal_elements(elements, relation):
    minimals = set()

    for a in elements:
        for b in elements - {a}:
            if (b, a) in relation:
                break
        else:
            minimals.add(a)

    return minimals

# return a set of all maximal elements of a partially ordered set
def maximal_elements(elements, relation):
    maximals = set()

    for a in elements:
        for b in elements - {a}:
            if (a, b) in relation:
                break
        else:
            maximals.add(a)

    return maximals