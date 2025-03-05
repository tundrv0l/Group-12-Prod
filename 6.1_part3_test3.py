#Chapter 6.1
#Part 3 weighted graphs with adjacency matrix/list

import networkx as nx
import matplotlib.pyplot as plt
import json

def get_graph_input():
    graph_type = input("Enter 'd' for directed graph or 'u' for undirected graph: ").strip().lower()
    
    if graph_type == 'd':
        G = nx.DiGraph()  # Directed Weighted Graph
    elif graph_type == 'u':
        G = nx.Graph()  # Undirected Weighted Graph
    else:
        print("Invalid input! Please enter 'd' or 'u'.")
        return get_graph_input()  # Ask again
    
    num_nodes = int(input("Enter the number of nodes: "))
    num_edges = int(input("Enter the number of edges: "))
    
    print("Enter edges in the format: node1 node2 weight")
    for _ in range(num_edges):
        u, v, w = input().split()
        G.add_edge(u, v, weight=float(w))  # Store weight as a float
    
    return G

def plot_graph(G):
    plt.figure(figsize=(8, 6))
    pos = nx.spring_layout(G)  # Layout for visualization
    
    edge_labels = {(u, v): G[u][v]['weight'] for u, v in G.edges()}
    
    nx.draw(G, pos, with_labels=True, node_color='skyblue', edge_color='gray', node_size=2000, font_size=15, font_weight="bold", arrows=True)
    nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_labels, font_size=12, font_color="red")  # Draw weights
    
    plt.title("Weighted Graph Visualization")
    plt.show()

def get_adjacency_matrix(G):
    nodes = list(G.nodes())  # Get node order
    node_index = {node: i for i, node in enumerate(nodes)}  # Assign index to nodes
    
    size = len(nodes)
    adj_matrix = [[0] * size for _ in range(size)]  # Default 0 for no connection

    for u, v in G.edges():
        i, j = node_index[u], node_index[v]
        adj_matrix[i][j] = G[u][v]['weight']  # Store weight
        if not isinstance(G, nx.DiGraph):  # If undirected, make symmetric
            adj_matrix[j][i] = G[u][v]['weight']

    return nodes, adj_matrix

def get_adjacency_list(G):
    adj_list = {node: {neighbor: G[node][neighbor]['weight'] for neighbor in G.neighbors(node)} for node in G.nodes()}
    return adj_list

def save_to_json(G):
    nodes, adj_matrix = get_adjacency_matrix(G)
    adj_list = get_adjacency_list(G)

    data = {
        "adjacency_matrix": {str(nodes[i]): row for i, row in enumerate(adj_matrix)},
        "adjacency_list": adj_list
    }

    with open("weighted_graph_data.json", "w") as f:
        json.dump(data, f, indent=4)

    print("\nGraph data saved to 'weighted_graph_data.json'.")

def print_adjacency_matrix(G):
    nodes, adj_matrix = get_adjacency_matrix(G)

    print("\nAdjacency Matrix (Weighted):")
    print("   ", "  ".join(map(str, nodes)))  # Print column labels
    for i, row in enumerate(adj_matrix):
        print(nodes[i], row)  # Print row label + matrix row

def print_adjacency_list(G):
    adj_list = get_adjacency_list(G)
    
    print("\nAdjacency List (Weighted):")
    for node, neighbors in adj_list.items():
        print(f"{node}: {neighbors}")

# Run the program
G = get_graph_input()
plot_graph(G)
print_adjacency_matrix(G)
print_adjacency_list(G)
save_to_json(G)
