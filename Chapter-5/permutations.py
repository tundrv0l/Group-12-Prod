# File: permutations.py
# Author: Jacob Warren
# Description: 5.4 stuff

# Function: cycle_form
# Input: permutation in the form of a dictionary
# Output: cycle representation of the provided permutation
#         in the form of a list of tuples
def cycle_form(permutation):
    visited = set()
    cycles = []

    for element in permutation:
        # start next cycle
        if element not in visited:
            cycle = []
            current = element
            
            # create the current cycle
            while current not in visited:
                visited.add(current)
                cycle.append(current)
                current = permutation[current]
            
            # add cycle to the composition
            if len(cycle) > 1:
                # put the lowest element first in cycle
                min_element = min(cycle)
                min_index = cycle.index(min_element)
                normalized_cycle = cycle[min_index:] + cycle[:min_index]
                cycles.append(tuple(normalized_cycle))

    # sort the cycles by the lowest first element in the cycle
    # (they are disjoint, so composition is commutative)
    cycles.sort(key=lambda x: x[0])

    return cycles

# Function: disjoint_form
# Input: a composition of cycles in the form of a list of tuples
#        (possibly not disjoint)
# Output: a disjoint cycle representation of the same mapping
#         in the form of a list of tuples
def disjoint_form(cycles):
    multi_mapping = {}
    cycle_count = 0
    
    # traverse cycles in composition order
    for cycle in reversed(cycles):
        # traverse current cycle
        for i in range(len(cycle)):
            # for any elements present, make a dictionary
            if cycle[i] not in multi_mapping:
                multi_mapping[cycle[i]] = {}

            # record what is mapped to and in what cycle 
            # example: A maps to B in cycle 2 = {A: {2: B, ...}, ...}
            multi_mapping[cycle[i]][cycle_count] = cycle[(i + 1) % len(cycle)]

        cycle_count = cycle_count + 1

    permutation = {}

    for element in multi_mapping:
        result = element

        # traverse through all cycles for each present element
        for i in range(0, cycle_count):
            # if the element was mapped in the current cycle,
            # update the result
            if i in multi_mapping[result]:
                result = multi_mapping[result][i]

        # 1->2->3 = {1: 3, ...}
        permutation[element] = result

    return cycle_form(permutation)

# unit tests
def main():
    # test cases for permutation -> cycle form
    permutations = [
        {1: 3, 2: 1, 3: 5, 4: 4, 5: 2}, # 53.a
        {1: 4, 2: 5, 3: 2, 4: 3, 5: 1}, # 53.b
        {}                              # edge case
    ]

    for i in range(0, len(permutations)):
        print(f"Cycle form {i}:", cycle_form(permutations[i]))

    # test cases for cycle form -> disjoint cycle form
    cycle_forms = [
        [(2, 4, 5, 3), (1, 3)],                                                              # 56.a
        [(3, 5, 2), (2, 1, 3), (4, 1)],                                                      # 56.b
        [(2, 4), (1, 2, 5), (2, 3, 1), (5, 2)],                                              # 56.c
        [(1, 3, 4), (5, 1, 2)],                                                              # 57.a
        [(2, 7, 8), (1, 2, 4, 6, 8)],                                                        # 57.b
        [(1, 3, 4), (5, 6), (2, 3, 5), (6, 1)],                                              # 57.c
        [(2, 7, 1, 3), (2, 8, 7, 5), (4, 2, 1, 8)],                                          # 57.d
        [(3, 5, 2), (6, 2, 4, 1), (4, 8, 6, 2)],                                             # 58.a
        [(1, 5, 13, 2, 6), (3, 6, 4, 13), (13, 2, 6, 1)],                                    # 58.b
        [(1, 2), (1, 3), (1, 4), (1, 5)],                                                    # 58.c
        [('a', 'd', 'c', 'e'), ('d', 'c', 'b'), ('e', 'c', 'a', 'd'), ('a', 'c', 'b', 'd')], # 59.a
        [('e', 'b', 'a'), ('b', 'e', 'd'), ('d', 'a')],                                      # 59.b
        [('b', 'e', 'd'), ('d', 'a'), ('e', 'a', 'c'), ('a', 'c', 'b', 'e')],                # 59.c
        []                                                                                   # edge case
    ]

    for i in range(0, len(cycle_forms)):
        print(f"Disjoint form {i}:", disjoint_form(cycle_forms[i]))

if __name__ == "__main__":
    main()