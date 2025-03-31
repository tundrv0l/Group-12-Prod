#File: compisitions_solver.py
#Author: Mathias Buchanan
#Solves: 5.4, no problems associated

import json

def solve(setOneSize, setTwoSize):
    if isinstance(setOneSize, str):
        setOneSize = int(setOneSize)
    if isinstance(setTwoSize, str):
        setTwoSize = int(setTwoSize)
    permutations = 1
    compisitions = 1

    i = 1 + setOneSize - setTwoSize
    while i <= setOneSize:
        permutations = permutations * i
        i += 1
    
    compisitions = permutations

    for i in range(setTwoSize):
        compisitions /= (i + 1)

    result = {
        "perm": permutations,
        "comp": compisitions
    }

    return json.dumps(result)