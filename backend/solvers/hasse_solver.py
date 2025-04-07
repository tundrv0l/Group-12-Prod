# File: hasse_solver.py
# Author: Jacob Warren
# Solves: 5.1.31

import os
import sys
import json
import networkx as nx
import matplotlib
matplotlib.use('Agg') # Use to generate diagrams without a display
import matplotlib.pyplot as plt
from io import BytesIO
import base64

# Append the parent directory to the path so we can import in utility
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from solvers.util import strings
from solvers.util import methods
from solvers import properties_solver
from solvers.util import exceptions

'''
==========
parameters
==========
set_string: a string containing the inputted set
    - example: "{a, b}" 
    - restrictions: if the element has commas in it, it must either be a set, a tuple, or 
                    a list
relation_string: a string containing the inputted relation
    - example: "{(a, a), (b, b)}"
    - restrictions: the elements must all be pairs, the elements in the pairs must come 
                    from the set, and the relation must be a partial order
======
result
======
img_data: a base64 encoding of an image of the Hasse diagram generated
          by the set and relation
'''
def solve(set_string, relation_string):
    properties = properties_solver.not_string(set_string, relation_string)

    if not properties[0] or not properties[4] or not properties[5]:
        raise exceptions.CalculateError(f"Not a partial order.")

    set_list, relation = strings.is_a_relation(set_string, relation_string)
    set_ = {i for i in range(0, len(set_list))}

    relation = relation - methods.reflexive_filter(set_, relation)
    relation = relation - methods.transitive_filter(set_, relation)

    img_data = generate_diagram(set_list, relation)

    result = {
        "Hasse Diagram": img_data 
    }

    return json.dumps(result)

def generate_diagram(set_list, relation):
    # determine the layer each element is in
    size = len(set_list)
    set_ = {i for i in range(0, size)}
    layers = methods.generate_layers(set_, relation, set_list, size)
    
    # generate the Hasse diagram
    G = nx.Graph()
    G.add_nodes_from(set_list)
    G.add_edges_from([(set_list[a], set_list[b]) for (a, b) in relation])
    pos = nx.multipartite_layout(G, subset_key=layers, align="horizontal")
    plt.figure()
    nx.draw(G, pos, with_labels=True, node_size=2000, node_color="skyblue", font_size=15, font_color="black", font_weight="bold")
    plt.title("Hasse Diagram")

    # convert to image
    img_buf = BytesIO()
    plt.savefig(img_buf, format='png')
    img_buf.seek(0)
    img_data = base64.b64encode(img_buf.getvalue()).decode('utf-8')
    plt.close()

    return img_data

