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
from solvers.properties_solver import solve as properties_solver
from solvers.util import exceptions


'''
==========
parameters
==========
data[0]: a string containing the inputted set
    - example: "{a, b}" 
    - restrictions: if the element has commas in it, it must either be a set, a tuple, or 
                    a list
data[1]: a string containing the inputted relation
    - example: "{(a, a), (b, b)}"
    - restrictions: the elements must all be pairs, the elements in the pairs must come 
                    from data[0], and the relation must be a partial order
======
result
======
string: a string representing the filtered relation that can be used to generate
        a Hasse diagram directly
'''
def solve(set, relation):
    print(f"Input set: {set}")
    print(f"Input relation: {relation}")

    _, properties = properties_solver(set, relation)
    print(f"Properties: {properties}")

    data = [set, relation]

    if not properties[0] or not properties[4] or not properties[5]:
        raise exceptions.CalculateError(f"Not a partial order.")

    set_list, relation = strings.is_a_relation(data[0], data[1])
    print(f"Set list: {set_list}")
    print(f"Relation: {relation}")

    set_ = {i for i in range(0, len(set_list))}
    print(f"Set_: {set_}")

    relation = relation - methods.reflexive_filter(set_, relation)
    relation = relation - methods.transitive_filter(set_, relation)
    print(f"Filtered relation: {relation}")

    hasse_string = "{"

    for pair in relation:
        hasse_string += f"({set_list[pair[0]]}, {set_list[pair[1]]}), "

    if relation:
        hasse_string = hasse_string[:-2]

    hasse_string += "}"

    print(f"Hasse string: {hasse_string}")

    img_data =_generate_diagram(relation, set_list)

    result = {
        "Hasse Diagram": img_data 
    }

    return json.dumps(result)

def _generate_diagram(relation, set_list):

    # Generate the Hasse diagram using networkx
    G = nx.DiGraph()
    for pair in relation:
        G.add_edge(set_list[pair[0]], set_list[pair[1]])

    pos = nx.shell_layout(G)
    plt.figure()
    nx.draw(G, pos, with_labels=True, node_size=2000, node_color="skyblue", font_size=15, font_color="black", font_weight="bold", arrows=True)
    plt.title("Hasse Diagram")

    # Convert the diagram to an image in memory
    img_buf = BytesIO()
    plt.savefig(img_buf, format='png')
    img_buf.seek(0)
    img_data = base64.b64encode(img_buf.getvalue()).decode('utf-8')
    plt.close()

    return img_data