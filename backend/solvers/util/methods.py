# File: methods.py
# Author: Jacob Warren
# Description: Chapter 5 helper functions

def reflexive_closure(set_, relation):
    closure = set()
    for a in set_:
        if (a, a) not in relation:
            closure.add((a, a))

    return closure

def symmetric_closure(relation):
    closure = set()
    for (a, b) in relation:
        if (b, a) not in relation:
            closure.add((b, a))

    return closure

def transitive_closure(relation):
    closure = set(relation)
    changed = True
    while changed:
        changed = False
        for (a, b) in relation | closure:
            for (c, d) in relation | closure:
                if b == c and (a, d) not in relation | closure:
                    changed = True
                    closure.add((a, d))

    return closure

def transitive_filter(set_, relation):
    removal = set()
    non_reflexive = relation - reflexive_filter(set_, relation)
    for (a, b) in non_reflexive:
        for (c, d) in non_reflexive:
            if b == c and (a, d) in relation:
                removal.add((a, d))

    return removal

def reflexive_filter(set_, relation):
    removal = set()
    for a in set_:
        if (a, a) in relation:
            removal.add((a, a))

    return removal

def least_element(set_, relation):
    for a in set_:
        for b in set_:
            if (a, b) not in relation:
                break
        else:
            return a

    return None

def greatest_element(set_, relation):
    for a in set_:
        for b in set_:
            if (b, a) not in relation:
                break
        else:
            return a

    return None

def minimal_elements(set_, relation):
    minimals = set()
    for a in set_:
        for b in set_ - {a}:
            if (b, a) in relation:
                break
        else:
            minimals.add(a)

    return minimals

def maximal_elements(set_, relation):
    maximals = set()
    for a in set_:
        for b in set_ - {a}:
            if (a, b) in relation:
                break
        else:
            maximals.add(a)

    return maximals

def generate_descendents(set_, relation):
    descendents = {}
    for e in set_:
        descendents[e] = []
        for (a, b) in relation:
            if a == e:
                descendents[e].append(b)

    return descendents
