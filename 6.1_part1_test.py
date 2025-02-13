#Chapter 6.1
#Part 1, graphs

import networkx as nx
import matplotlib.pyplot as plt

def get_graph_input():
    graph_type = input("Enter 'd' for directed graph or 'u' for undirected graph: ").strip().lower()
    
    if graph_type == 'd':
        G = nx.DiGraph()  # Directed Graph
    elif graph_type == 'u':
        G = nx.Graph()  # Undirected Graph
    else:
        print("Invalid input! Please enter 'd' or 'u'.")
        return get_graph_input()  # Ask again
    
    num_nodes = int(input("Enter the number of nodes: "))
    num_edges = int(input("Enter the number of edges: "))
    
    print("Enter edges in the format: node1 node2")
    for _ in range(num_edges):
        u, v = input().split()
        G.add_edge(u, v)
    
    return G

def plot_graph(G):
    plt.figure(figsize=(8, 6))
    pos = nx.spring_layout(G)  # Layout for visualization
    nx.draw(G, pos, with_labels=True, node_color='skyblue', edge_color='gray', node_size=2000, font_size=15, font_weight="bold", arrows=True)
    plt.title("Graph Visualization")
    plt.show()

# Run the program
G = get_graph_input()
plot_graph(G)

#---isomorphic---

def get_graph_input():
    graph_type = input("Enter 'd' for directed graph or 'u' for undirected graph: ").strip().lower()
    
    if graph_type == 'd':
        G = nx.DiGraph()
    elif graph_type == 'u':
        G = nx.Graph()
    else:
        print("Invalid input! Please enter 'd' or 'u'.")
        return get_graph_input()
    
    num_edges = int(input("Enter the number of edges: "))
    print("Enter edges in the format: node1 node2")
    
    for _ in range(num_edges):
        u, v = input().split()
        G.add_edge(u, v)
    
    return G

def plot_graphs(G1, G2, isomorphic):
    fig, axs = plt.subplots(1, 2, figsize=(12, 6))

    pos1 = nx.spring_layout(G1)
    pos2 = nx.spring_layout(G2)

    axs[0].set_title("Graph 1")
    nx.draw(G1, pos1, with_labels=True, node_color='lightblue', edge_color='gray', node_size=2000, font_size=15, ax=axs[0])

    axs[1].set_title("Graph 2")
    nx.draw(G2, pos2, with_labels=True, node_color='lightcoral', edge_color='gray', node_size=2000, font_size=15, ax=axs[1])

    plt.suptitle(f"Graphs are Isomorphic: {isomorphic}", fontsize=14, fontweight='bold')
    plt.show()

# Get two graphs
print("Input for Graph 1:")
G1 = get_graph_input()
print("\nInput for Graph 2:")
G2 = get_graph_input()

# Check if they are isomorphic
isomorphic = nx.is_isomorphic(G1, G2)

# Plot the graphs
plot_graphs(G1, G2, isomorphic)

'''
#---Petersen Graph---

def get_petersen_graph():
    G = nx.petersen_graph()  # Generate Petersen graph
    return G

def plot_graph(G):
    plt.figure(figsize=(8, 6))
    pos = nx.spring_layout(G)  # Layout for visualization
    nx.draw(G, pos, with_labels=True, node_color='skyblue', edge_color='gray', node_size=2000, font_size=15, font_weight="bold")
    plt.title("Petersen Graph Visualization")
    plt.show()

# Generate and plot the Petersen graph
G = get_petersen_graph()
plot_graph(G)'''


#-----------------End of Part 1------------------

import networkx as nx
import matplotlib.pyplot as plt

def get_graph_input():
    graph_type = input("Enter 'd' for directed graph or 'u' for undirected graph: ").strip().lower()
    
    if graph_type == 'd':
        G = nx.DiGraph()  # Directed Graph
    elif graph_type == 'u':
        G = nx.Graph()  # Undirected Graph
    else:
        print("Invalid input! Please enter 'd' or 'u'.")
        return get_graph_input()  # Ask again
    
    num_nodes = int(input("Enter the number of nodes: "))
    num_edges = int(input("Enter the number of edges: "))
    
    print("Enter edges in the format: node1 node2")
    for _ in range(num_edges):
        u, v = input().split()
        G.add_edge(u, v)
    
    return G

def plot_graph(G):
    plt.figure(figsize=(8, 6))
    pos = nx.spring_layout(G)  # Layout for visualization
    nx.draw(G, pos, with_labels=True, node_color='skyblue', edge_color='gray', node_size=2000, font_size=15, font_weight="bold", arrows=True)
    plt.title("Graph Visualization")
    plt.show()

def print_adjacency_matrix(G):
    nodes = list(G.nodes())  # Get node order
    node_index = {node: i for i, node in enumerate(nodes)}  # Assign index to nodes
    
    # Initialize adjacency matrix with 0s
    size = len(nodes)
    adj_matrix = [[0] * size for _ in range(size)]

    # Populate matrix based on edges
    for u, v in G.edges():
        i, j = node_index[u], node_index[v]
        adj_matrix[i][j] = 1
        if not isinstance(G, nx.DiGraph):  # If undirected, make symmetric
            adj_matrix[j][i] = 1

    # Print adjacency matrix in readable format
    print("\nAdjacency Matrix:")
    print("   ", "  ".join(map(str, nodes)))  # Print column labels
    for i, row in enumerate(adj_matrix):
        print(nodes[i], row)  # Print row label + matrix row

# Run the program
G = get_graph_input()
plot_graph(G)
print_adjacency_matrix(G)


