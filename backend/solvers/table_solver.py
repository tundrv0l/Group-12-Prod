# File: table_solver.py
# Author: Jacob Warren
# Solves: 5.2.3 and 5.2.4

import json
import os
import sys
import networkx as nx
import matplotlib
matplotlib.use('Agg') # Use to generate diagrams without a display
import matplotlib.pyplot as plt
from io import BytesIO
import base64

# Append the parent directory to the path so we can import in utility
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from solvers.util import exceptions

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
    # Generate the Hasse diagram using networkx
    G = nx.DiGraph()
    for task in table:
        if table[task][1] < 0:
            raise exceptions.CalculateError(f"{task} has a negative time.")

        G.add_node(task + f"({table[task][1]})")

        for prereq in table[task][0]:
            if prereq == task:
                raise exceptions.CalculateError(f"{task} can not be its own prereq.")

            try:
                G.add_edge(prereq + f"({table[prereq][1]})", task + f"({table[task][1]})")
            except ValueError:
                raise exceptions.CalculateError(f"{task} has a non-existent prereq.")

    pos = nx.shell_layout(G)
    plt.figure()
    nx.draw(G, pos, with_labels=True, node_size=2000, node_color="skyblue", font_size=15, font_color="black", font_weight="bold", arrows=True)
    plt.title("PERT Diagram")

    # Convert the diagram to an image in memory
    img_buf = BytesIO()
    plt.savefig(img_buf, format='png')
    img_buf.seek(0)
    img_data = base64.b64encode(img_buf.getvalue()).decode('utf-8')
    plt.close()

    return img_data
