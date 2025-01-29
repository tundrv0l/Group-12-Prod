import methods

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
                    print("Pairs must be comprised of elements from your set.")
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
        print("Reflexive Closure:", methods.reflexive_closure(elements, relation))
    if not symmetric:
        print("Symmetric Closure:", methods.symmetric_closure(relation))
    if not transitive:
        print("Transitive Closure:", methods.transitive_closure(relation))

    # Output special elements of partial orders
    if reflexive and antisymmetric and transitive:
        least = methods.least_element(elements, relation)
        if least:
            print("Least Element: ", least)

        greatest = methods.greatest_element(elements, relation)
        if greatest:
            print("Greatest Element: ", greatest)
        
        minimals = methods.minimal_elements(elements, relation)
        if minimals:
            print("Minimal Elements: ", minimals)

        maximals = methods.maximal_elements(elements, relation)
        if maximals:
            print("Maximal Elements: ", maximals)

if __name__ == "__main__":
    main()