import networkx as nx
import matplotlib.pyplot as plt
def solve(input):
    class Node:
        def __init__(self, value):
            self.value = value
            self.left = None
            self.right = None

    def build_tree_from_table(input_data):
        """Builds a binary tree from left-child right-child table."""
        node_map = {}  
        edges = []  
        root_value = None  

        print("Building tree with predefined inputs...")

        for line in input_data:
            try:
                node, left, right = line.split()
                if node not in node_map:
                    node_map[node] = Node(node)
                if root_value is None:
                    root_value = node  

                if left != '0':
                    if left not in node_map:
                        node_map[left] = Node(left)
                    node_map[node].left = node_map[left]
                    edges.append((node, left))

                if right != '0':
                    if right not in node_map:
                        node_map[right] = Node(right)
                    node_map[node].right = node_map[right]
                    edges.append((node, right))
            except Exception as e:
                print(f"Error processing input: {e}")
                break

        return node_map[root_value], edges  # Return root and edges for drawing

    def add_edges(graph, root, pos, x=0, y=0, level=1):
        """Recursively add edges to the graph for visualization."""
        if root:
            pos[root.value] = (x, y)
            if root.left:
                graph.add_edge(root.value, root.left.value)  # Corrected line
                add_edges(graph, root.left, pos, x - 1 / 2**level, y - 1, level + 1)
            if root.right:
                graph.add_edge(root.value, root.right.value)  # Corrected line
                add_edges(graph, root.right, pos, x + 1 / 2**level, y - 1, level + 1)


    def draw_tree(root):
        """Draws the binary tree using networkx and matplotlib."""
        graph = nx.DiGraph()
        pos = {}
        add_edges(graph, root, pos)
        plt.figure(figsize=(6, 4))
        nx.draw(graph, pos, with_labels=True, node_size=2000, node_color="lightblue", font_size=10, edge_color="gray")
        plt.show()
    
    root, edges = build_tree_from_table(input)
    if root:
        print("\nBinary Tree Constructed! Visualizing...\n")
        draw_tree(root)
    else:
        print("No valid tree constructed.")

# Example Usage:
input_data = [
    "+ 1 3",
    "1 0 0",
    "3 0 0"
]
solve(input_data)


