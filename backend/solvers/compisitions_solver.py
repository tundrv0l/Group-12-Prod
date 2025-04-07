# compisitions_solver.py
# Author: Mathias Buchanan
# Solves: 4.4 permutation problems

import json

def strike(text):
    return ''.join(c + '\u0336' for c in str(text))

def solve(setOneSize, setTwoSize):
    if isinstance(setOneSize, str):
        setOneSize = int(setOneSize)
    if isinstance(setTwoSize, str):
        setTwoSize = int(setTwoSize)

    i = setOneSize
    j = setOneSize - setTwoSize

    # Permutations string
    k = i - 1
    permutations = str(i)
    while k > j:
        permutations += " * " + str(k)
        k -= 1

    # Composition logic
    l = list(range(2, setTwoSize + 1)) if j > setTwoSize else list(range(2, j + 1))
    if j <= setTwoSize:
        j = setTwoSize

    k = i
    composition_parts = []

    while k > j:
        printed_num = k
        part = []

        for idx in reversed(range(len(l))):
            divisor = l[idx]
            if isinstance(divisor, int) and printed_num % divisor == 0:
                part.append(strike(str(printed_num)))
                printed_num //= divisor
                l[idx] = strike(str(divisor))  # cross it out

        part.append(str(printed_num))
        composition_parts.append(" ".join(part))
        k -= 1

    compositions = " * ".join(composition_parts)

    compositions += " / (" + " * ".join(str(x) for x in l) + ")"

    if setOneSize == setTwoSize:
        compositions = "1"

    result = {
        "perm": permutations,
        "comp": compositions
    }

    return json.dumps(result)

# Example Usage
output = solve(55, 50)
print(output)
