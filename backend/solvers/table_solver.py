# File: table_solver.py
# Author: Jacob Warren
# Solves: 5.2.3 and 5.2.4

import json
import os
import sys
import networkx as nx

# Append the parent directory to the path so we can import in utility
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from solvers.util import exceptions
from solvers.util import methods
from solvers.util import images

'''
==========
parameters
==========
table: a table of timed tasks represented by
       a dictionary with keys equal to the task name and with
       data equal to a tuple of the set of prerequisite task 
       names and the time for the task
    - example: {"ADB": ({"1"}, 3), "1": ({}, 4)}
    - restrictions: the prereqs must be pulled from the other tasks
                    in the table, task times must be non-negative, and
                    untimed tables are represented by having all 0-time tasks
======
result
======
img: a base64 encoding of an image of the PERT diagram generated
     by the table
'''
def solve(table):
    img_data = generate_diagram(table)
    
    result = {
        "PERT Diagram": img_data
    }

    return json.dumps(result)

def not_string(table):
    set_list = list(table.keys())
    relation = set()

    for task in table:
        if table[task][1] < 0:
            raise exceptions.CalculateError(f"{task} has a negative time.")

        for prereq in table[task][0]:
            if prereq == task:
                raise exceptions.CalculateError(f"{task} can not be its own prereq.")
            
            try:
                relation.add((set_list.index(prereq), set_list.index(task)))
            except ValueError:
                raise exceptions.CalculateError(f"{task} has a non-existent prereq.")

    return set_list, relation

def generate_diagram(table):
    # determine the layer each element is in
    set_list, relation = not_string(table)
    size = len(set_list)
    set_ = {i for i in range(0, size)}
    relation = relation - (methods.transitive_closure(relation) - relation)
    labels = [f"{set_list[e]}({table[set_list[e]][1]})" for e in range(0, size)]
    layers = methods.generate_layers(set_, relation, labels, size)

    # make the graph
    graph = nx.DiGraph()
    graph.add_nodes_from([labels[e] for e in set_])
    graph.add_edges_from([(labels[a], labels[b]) for (a, b) in relation])
    pos = nx.multipartite_layout(graph, subset_key=layers, align="vertical")

    return images.graph_to_base64(graph, pos)
