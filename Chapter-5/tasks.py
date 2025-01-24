def least_element(elements, relation):
    for a in elements:
        for b in elements:
            if (a,b) not in relation:
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
    
def main():


if __name__ == "__main__":
    main()