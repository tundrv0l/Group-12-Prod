#Chapter 6.1
#Part 2, adjacency matrix/lists
# Author: Michael Lowder

import networkx as nx
import matplotlib
import matplotlib.pyplot as plt
import json
matplotlib.use('Agg') # Use to generate diagrams without displaying them
from io import BytesIO
import base64


def solve(graphInput, graphType):
    '''
        A driver function to generate adjacency matrix/list representations of a graph.

        Parameters
        ----------
        graphInput (str): 
            String representing the edges of the graph
        graphType (str): 
            The type of graph to create (directed or undirected)

        Returns
        ----------
        result: json
            Returned a json object with the results
    '''
    try:
        # Parse the input into a list of tuples
        graphInput = graphInput.replace("),(", "), (")
        graphInput = graphInput.strip("{}").split("), (")
        input_list = [tuple(item.strip("()").split(",")) for item in graphInput]

        # Strip whitespace from each element in the tuples
        input_list = [(x.strip(), y.strip()) for x, y in input_list]

        G = get_graph_input(input_list, graphType)
        img_data = plot_graph(G)
        nodes, adj_matrix = get_adjacency_matrix(G)
        adj_list = get_adjacency_list(G)

        result = {
            "Graph": img_data,
            "Matrix": {str(nodes[i]): row for i, row in enumerate(adj_matrix)},
            "List": adj_list
        }

        return json.dumps(result)
    
    except Exception:
        return json.dumps({"error": "An error occurred. Please check your input and try again."})


def get_graph_input(input_list, graphType):
    '''
        A function to create a graph from the input.
        Parameters
        ----------
        input_list (list):
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

    for pair in input_list:
        G.add_edge(pair[0], pair[1])

    return G

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
    plt.savefig(img_buf, format='png', bbox_inches='tight')
    img_buf.seek(0)
    img_data = base64.b64encode(img_buf.getvalue()).decode('utf-8')
    print(img_data)
    plt.close()
    return img_data

def get_adjacency_matrix(G):
    '''
        A function to return the adjacency matrix form of the graph.
        ----------
        G (Graph/DiGraph):
            Inputted graph object

        Returns
        ----------
        nodes: list
            List of nodes in the graph
        adj_matrix: list[list[int]]
            Adjacency matrix representation of the graph
    '''

    nodes = list(G.nodes())  # Get node order
    node_index = {node: i for i, node in enumerate(nodes)}  # Assign index to nodes

    size = len(nodes)
    adj_matrix = [[0] * size for _ in range(size)]

    for u, v in G.edges():
        i, j = node_index[u], node_index[v]
        adj_matrix[i][j] = 1
        if not isinstance(G, nx.DiGraph):  # If undirected, make symmetric
            adj_matrix[j][i] = 1

    return nodes, adj_matrix

def get_adjacency_list(G):
    '''
        A function to return the adjacency list form of the graph.
        ----------
        G (Graph/DiGraph):
            Inputted graph object

        Returns
        ----------
        adj_list: dict
            Adjacency list representation of the graph
    '''
    adj_list = {node: list(G.neighbors(node)) for node in G.nodes()}
    return adj_list