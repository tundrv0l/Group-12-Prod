import copy

def reflexive_closure(elements, relation):
    closure = copy.deepcopy(relation)

    for element in elements:
        closure.add((element, element))

    return closure

def symmetric_closure(relation):
    closure = copy.deepcopy(relation)

    for (a, b) in relation:
        closure.add((b, a))

    return closure

def transitive_closure(relation):
    closure = copy.deepcopy(relation)

    for (a, b) in relation:
        for (c, d) in relation:
                if b == c:
                    closure.add((a, d))

    return closure

def least_element(elements, relation):
    for a in elements:
        for b in elements:
            if (a,b) not in relation:
                break
        else:
            return a

    return None

def greatest_element(elements, relation):
    for a in elements:
        for b in elements:
            if (b,a) not in relation:
                break
        else:
            return a

    return None

def minimal_elements(elements, relation):
    minimals = set()

    for a in elements:
        for b in elements - set(a):
            if (b,a) in relation:
                break
        else:
            minimals.add(a)

    return minimals

def maximal_elements(elements, relation):
    maximals = set()

    for a in elements:
        for b in elements - set(a):
            if (a,b) in relation:
                break
        else:
            maximals.add(a)

    return maximals