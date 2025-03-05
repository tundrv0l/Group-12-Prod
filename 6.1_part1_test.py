#Chapter 6.1
#Part 1, graphs
import networkx as nx
import matplotlib
import matplotlib.pyplot as plt
import json
#matplotlib.use('Agg') # Use to generate diagrams d
from io import BytesIO
import base64
'''
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
    img_buf = BytesIO()
    plt.savefig(img_buf, format='png')
    img_buf.seek(0)
    img_data = base64.b64encode(img_buf.getvalue()).decode('utf-8')
    print(img_data)
    plt.close()
    return img_data
    #plt.show()

# Run the program
G = get_graph_input()
plot_graph(G)
#'''
#---isomorphic---
def solve(input, type, isIsomorphic, secondInput):
    try:
        def get_graph_input(input_str, type):
            graph_type = type
            #print(graph_type) test case
            if graph_type == 'd':
                G = nx.DiGraph()
            elif graph_type == 'u':
                G = nx.Graph()
            else:
                print("Invalid input! Please enter 'd' or 'u'.")
                graph_type = "u" #test case
                return get_graph_input(graph_type)
            
            #num_edges = int(input("Enter the number of edges: ")) # Test case. Take this out as needed
            print("Enter edges in the format: node1 node2")
            
            # for _ in range(num_edges):
            #     u, v = input().split()
            #     G.add_edge(u, v)
            for pair in input_str:
                G.add_edge(pair[0], pair[1])
            
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
            # base64 things
            img_buf = BytesIO()
            plt.savefig(img_buf, format='png')
            img_buf.seek(0)
            img_data = base64.b64encode(img_buf.getvalue()).decode('utf-8')
            print(img_data)
            plt.close()
            return img_data
            #plt.show()
        def plot_graph(G):
            plt.figure(figsize=(8, 6))
            pos = nx.spring_layout(G)  # Layout for visualization
            nx.draw(G, pos, with_labels=True, node_color='skyblue', edge_color='gray', node_size=2000, font_size=15, font_weight="bold", arrows=True)
            plt.title("Graph Visualization")
            img_buf = BytesIO()
            plt.savefig(img_buf, format='png')
            img_buf.seek(0)
            img_data = base64.b64encode(img_buf.getvalue()).decode('utf-8')
            print(img_data)
            plt.close()
            return img_data
            #plt.show()
        #Test Case:
        #isIsomorphic = False
        input1 = input
        input2 = secondInput

        input1 = input1.strip("{}").split("), (")

        # Parse each element into a tuple of variables
        input1_list = [tuple(item.strip("()").split(", ")) for item in input1]
        input2_list = [tuple(item.strip("()").split(", ")) for item in input2]

        if isIsomorphic:
            print("Input for Graph 1:")
            G1 = get_graph_input(input1_list, type)
            print("\nInput for Graph 2:")
            G2 = get_graph_input(input2_list, type)

            # Check if they are isomorphic
            isomorphic = nx.is_isomorphic(G1, G2)

            # Plot the graphs
            plot_graphs(G1, G2, isomorphic)
            print("test")
        else:
            G = get_graph_input(input1_list, type)
            plot_graph(G)
    except Exception as e:
        return {"success": False, "error": str(e)}
# TEST CASES: COMMENT OUT AS NEEDED
#firstInput = "{(A, B), (B, C), (C, A)}"
# secondInput = "{(A, B), (B, C), (C, A)}"
# isIsomorphic = False
# type = 'u'
#solve(firstInput, type, isIsomorphic, secondInput)

# Get two graphs
'''    print("Input for Graph 1:")
    G1 = get_graph_input()
    print("\nInput for Graph 2:")
    G2 = get_graph_input()

    # Check if they are isomorphic
    isomorphic = nx.is_isomorphic(G1, G2)

    # Plot the graphs
    plot_graphs(G1, G2, isomorphic)'''

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

