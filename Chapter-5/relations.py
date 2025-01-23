import copy

def check_properties(elements, relation):
    reflexive = True
    irreflexive = True
    symmetric = True
    asymmetric = True
    antisymmetric = True
    transitive = True

    # Check reflexive and irreflexive
    for element in elements:
        if (element, element) in relation:
            irreflexive = False
        else:
            reflexive = False

    # Check asymmetric, antisymmetric, and symmetric
    for (a, b) in relation:
        if (b, a) in relation:
            asymmetric = False
            if a != b:
                antisymmetric = False
        else:
            symmetric = False

    # Check transitive
    for (a, b) in relation:
        for (c, d) in relation:
            if b == c and (a,d) not in relation:
                transitive = False

    return reflexive, irreflexive, symmetric, asymmetric, antisymmetric, transitive

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

def main():
    # Input set of elements
    elements_input = input("Enter a set of elements: ")
    elements = set([e.strip() for e in elements_input.split(",")])

    # Input relation
    relation_input = input("Enter the relation as ordered pairs of elements: ")
    relation = set()
    
    # Process the input relation
    if relation_input.strip():  # Only process if input is not empty
        pairs = relation_input.split("),")
        for pair in pairs:
            pair = pair.strip()
            if pair.endswith(")"):
                pair = pair[:-1]  # Remove the closing parenthesis
            if pair.startswith("("):
                pair = pair[1:]  # Remove the opening parenthesis
            try:
                a, b = pair.split(",")
                if a not in elements or b not in elements:
                    print("Pairs must be comrpised of elements from your set.")
                    return
                relation.add((a.strip(), b.strip()))
            except ValueError:
                print(f"Invalid pair: {pair}. Please enter pairs in the format (a,b).")
                return

    # Check properties
    reflexive, irreflexive, symmetric, asymmetric, antisymmetric, transitive = check_properties(elements, relation)

    # Output results
    print("Properties of the relation:")
    print("Reflexive:", reflexive)
    print("Irreflexive:", irreflexive)
    print("Symmetric:", symmetric)
    print("Asymmetric:", asymmetric)
    print("Antisymmetric:", antisymmetric)
    print("Transitive:", transitive)

    # Output closures if they were generated
    if not reflexive:
        print("Reflexive Closure:", reflexive_closure(elements, relation))
    if not symmetric:
        print("Symmetric Closure:", symmetric_closure(relation))
    if not transitive:
        print("Transitive Closure:", transitive_closure(relation))

    # Output special elements of partial orders
    if reflexive and antisymmetric and transitive:
        least = least_element(elements, relation)
        if least:
            print("Least Element: ", least)

        greatest = greatest_element(elements, relation)
        if greatest:
            print("Greatest Element: ", greatest)
        
        minimals = minimal_elements(elements, relation)
        if minimals:
            print("Minimal Elements: ", minimals)

        maximals = maximal_elements(elements, relation)
        if maximals:
            print("Maximal Elements: ", maximals)

if __name__ == "__main__":
    main()