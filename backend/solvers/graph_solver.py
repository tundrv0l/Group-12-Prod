#Chapter 6.1
#Part 1, graphs
# Author: Michael Lowder

import networkx as nx
import matplotlib
import matplotlib.pyplot as plt
import json
matplotlib.use('Agg') # Use to generate diagrams without displaying them
from io import BytesIO
import base64

#---Begin Part 1---#
def solve(graphInput, graphType, isIsomorphic=False, secondInput=None):
    '''
        A driver function to call the appropriate function for Graphs.

        Parameters
        ----------
        graphInput (list): 
            List of tuples representing the edges of the graph
        graphType (json): 
            The type of graph to create (directed or undirected)
        isIsomorphic (bool):
            A boolean value to check if graphs are isomorphic
        secondInput (list):
            List of tuples representing the edges of the second 
                (only used if isIsomorphic is True)

        Returns
        ----------
        result: json
            Returned a json object with the base64 encoded image of the graph.
    '''

    try:

        # Initialize variables
        input1 = graphInput
        input2 = secondInput

        input1 = input1.replace("),(", "), (")
        if input2:
            input2 = input2.replace("),(", "), (")

        # Parse the input into a list of tuples
        input1 = input1.strip("{}").split("), (")

        # Parse each element into a tuple of variables
        input1_list = [tuple(item.strip("()").split(",")) for item in input1]

         # Strip whitespace from each element in the tuples
        input1_list = [(x.strip(), y.strip()) for x, y in input1_list]

        # Check if the graphs are isomorphic
        if isIsomorphic:
            
            # Parse the second input into a list of tuples
            input2 = input2.strip("{}").split("), (")
            input2_list = [tuple(item.strip("()").split(",")) for item in input2]
            input2_list = [(x.strip(), y.strip()) for x, y in input2_list]

            # Get the graphs from the input
            G1 = get_graph_input(input1_list, graphType)
            G2 = get_graph_input(input2_list, graphType)

            # Check if they are isomorphic
            isomorphic = nx.is_isomorphic(G1, G2)

            # Plot the graphs, generate base64 encoded image
            img_data = plot_graphs(G1, G2, isomorphic)

            # Return the base64 encoded image
            result = {
                "Graph": img_data 
            }

            return json.dumps(result)

        else:
            # Get the graph from the input
            G = get_graph_input(input1_list, graphType)

            # Plot the graph, generate base64 encoded image
            img_data = plot_graph(G)
            
            # Plot the graphs
            result = {
                "Graph": img_data 
            }
            return json.dumps(result)
        
    except Exception:
        return {"success": False, "error": "Something went wrong. Please check your input and try again."}

def get_graph_input(input_str, graphType):
    '''
        A function to create a graph from the input.
        Parameters
        ----------
        input_str (list):
            List of tuples representing the edges of the graph
        graphType (str):
            The type of graph to create (directed or undirected)

        Returns
        ----------
        G: Graph/DiGraph
            Returns a graph object based on the input.
    '''

    if graphType == 'DIRECTED':
        G = nx.DiGraph()
    elif graphType == 'UNDIRECTED':
        G = nx.Graph()

    for pair in input_str:
        G.add_edge(pair[0], pair[1])

    return G

def plot_graphs(G1, G2, isomorphic):
    '''
        A function to plot isomorphic graphs side by side.
        ----------
        G1 (Graph/DiGraph):
            First graph object
        G2 (Graph/DiGraph):
            Second graph object
        isomorphic (bool):
            Boolean value to check if graphs are isomorphic

        Returns
        ----------
        img_data: str
            A base64 encoded image string of the graphs.
    '''

    # Plot the graphs side by side
    _, axs = plt.subplots(1, 2, figsize=(10, 5))

    pos1 = nx.spring_layout(G1)
    pos2 = nx.spring_layout(G2)

    axs[0].set_title("Graph 1")
    nx.draw(G1, pos1, with_labels=True, node_color='lightblue', edge_color='gray', node_size=2000, font_size=15, ax=axs[0])

    axs[1].set_title("Graph 2")
    nx.draw(G2, pos2, with_labels=True, node_color='lightcoral', edge_color='gray', node_size=2000, font_size=15, ax=axs[1])

    plt.suptitle(f"Graphs are Isomorphic: {isomorphic}", fontsize=14, fontweight='bold')

    # Adjust layout to prevent cutting off labels
    plt.tight_layout(rect=[0, 0.03, 1, 0.95])  


    # Conversion to a base64 encoded image
    img_buf = BytesIO()
    plt.savefig(img_buf, format='png', bbox_inches='tight')
    img_buf.seek(0)
    img_data = base64.b64encode(img_buf.getvalue()).decode('utf-8')
    print(img_data)
    plt.close()
    return img_data

def plot_graph(G):
    '''
        A function to plot a graph.
        ----------
        G (Graph/DiGraph):
            Inputted graph object

        Returns
        ----------
        img_data: str
            A base64 encoded image string of the graphs.
    '''

    # Plot the graph
    plt.figure(figsize=(6, 4))
    pos = nx.spring_layout(G)  # Layout for visualization
    nx.draw(G, pos, with_labels=True, node_color='skyblue', edge_color='gray', node_size=2000, font_size=15, font_weight="bold", arrows=True)

    # Convert to base64 encoded image
    plt.title("Graph Visualization")
    img_buf = BytesIO()
    plt.savefig(img_buf, format='png')
    img_buf.seek(0)
    img_data = base64.b64encode(img_buf.getvalue()).decode('utf-8')
    print(img_data)
    plt.close()
    return img_data

#-----------------End of Part 1------------------
