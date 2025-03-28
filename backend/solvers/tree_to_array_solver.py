'''----------------- 
# Title: tree_to_array_solver.py
# Author: Michael Lowder
# Date: 3/14/2025
# Description: A solver for generating binary trees to array representations
-----------------'''

import re
from collections import deque
import networkx as nx
import matplotlib.pyplot as plt
from io import BytesIO
import base64
import json

class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

def build_tree_from_input(input_str):
    """Builds a binary tree from level-order user input."""
    if ',' in input_str:
        values = input_str.split(',')
    else:
        values = input_str.split()

    values = [v.strip() for v in values]
    values = [v if v.lower() != 'none' else 'None' for v in values]

    print(f"Parsed values: {values}")

    if not values or values[0] == 'None':
        return None, {}

    # Create root node
    root = Node(values[0])
    nodes = {values[0]: root}
    
    # Use level order traversal to build the tree
    queue = deque([root])
    i = 1  # Start from the second element
    
    while queue and i < len(values):
        current = queue.popleft()
        
        # Process left child
        if i < len(values):
            if values[i] != 'None':
                current.left = Node(values[i])
                nodes[values[i]] = current.left
                queue.append(current.left)
            i += 1  # Move to next value regardless
        
        # Process right child
        if i < len(values):
            if values[i] != 'None':
                current.right = Node(values[i])
                nodes[values[i]] = current.right
                queue.append(current.right)
            i += 1  # Move to next value regardless
    
    # Debug output to verify structure
    print("Tree structure:")
    for key, node in nodes.items():
        left_val = node.left.value if node.left else "None"
        right_val = node.right.value if node.right else "None"
        print(f"Node {key}: left={left_val}, right={right_val}")
    
    return root, nodes

def add_edges(graph, root, pos, x=0, y=0, level=1):
    """Recursively add edges to the graph."""
    if root:
        pos[root.value] = (x, y)
        if root.left:
            graph.add_edge(root.value, root.left.value)
            add_edges(graph, root.left, pos, x - 1 / 2**level, y - 1, level + 1)
        if root.right:
            graph.add_edge(root.value, root.right.value)
            add_edges(graph, root.right, pos, x + 1 / 2**level, y - 1, level + 1)

def draw_tree(root):
    """Draws a binary tree using networkx and matplotlib."""
    if not root:
        return None
        
    graph = nx.DiGraph()
    pos = {}
    add_edges(graph, root, pos)
    plt.figure(figsize=(6, 4))
    nx.draw(graph, pos, with_labels=True, node_size=2000, node_color="lightblue", font_size=10, edge_color="gray")
    plt.title("Binary Tree Visualization")
    
    img_buf = BytesIO()
    plt.savefig(img_buf, format='png')
    img_buf.seek(0)
    img_data = base64.b64encode(img_buf.getvalue()).decode('utf-8')
    plt.close()
    
    return img_data

def tokenize(expression):
    """Tokenizes an expression, handling implicit multiplication."""
    expression = expression.replace(" ", "")
    
    # Handle implicit multiplication: 3(x+y) → 3*(x+y)
    expression = re.sub(r'(\d)([a-zA-Z(])', r'\1*\2', expression)
    expression = re.sub(r'(\))(\d|[a-zA-Z])', r'\1*\2', expression)
    
    # Tokenize: Match numbers, variables, operators, and parentheses
    tokens = re.findall(r'\d+|[a-zA-Z]+|[+\-*/^()]', expression)
    
    return tokens

def precedence(op):
    """Returns precedence of operators."""
    return {'+': 1, '-': 1, '*': 2, '/': 2, '^': 3}.get(op, 0)

def to_postfix(tokens):
    """Converts infix expression to postfix notation (Reverse Polish Notation)."""
    output = []
    stack = []
    
    for token in tokens:
        if token.isalnum():  # Operand (number or variable)
            output.append(token)
        elif token == '(':
            stack.append(token)
        elif token == ')':
            while stack and stack[-1] != '(':
                output.append(stack.pop())
            stack.pop()  # Remove '('
        else:  # Operator
            while stack and stack[-1] != '(' and precedence(stack[-1]) >= precedence(token):
                output.append(stack.pop())
            stack.append(token)
    
    while stack:
        output.append(stack.pop())
    
    return output

def build_expression_tree(postfix_tokens):
    """Builds an expression tree from postfix notation."""
    stack = []
    nodes = {}  # Dictionary to store nodes
    
    for token in postfix_tokens:
        node = Node(token)
        
        if token in "+-*/^":  # Operator
            if len(stack) < 2:
                return None, {}
            
            node.right = stack.pop()  # First pop is right child
            node.left = stack.pop()   # Second pop is left child
        
        stack.append(node)
        nodes[token] = node  # Store node in dictionary
    
    if len(stack) != 1:
        return None, {}
    
    # Need to rebuild the nodes dictionary to include all nodes in the tree
    complete_nodes = {}
    
    def traverse_and_collect(node, nodes_dict):
        if node:
            nodes_dict[node.value] = node
            traverse_and_collect(node.left, nodes_dict)
            traverse_and_collect(node.right, nodes_dict)
    
    traverse_and_collect(stack[0], complete_nodes)
    
    return stack[0], complete_nodes

def add_edges_for_expression_tree(graph, node, pos, node_ids, x=0, y=0, level=1, x_spacing=1.5):
    """Recursively adds edges to the graph and positions nodes uniquely."""
    if node:
        node_id = node_ids[node]  # Get the unique ID for this node
        pos[node_id] = (x, y)  # Assign position
        
        if node.left:
            left_id = node_ids[node.left]
            graph.add_edge(node_id, left_id)
            add_edges_for_expression_tree(graph, node.left, pos, node_ids, x - x_spacing / (2 ** level), y - 1, level + 1, x_spacing)
        
        if node.right:
            right_id = node_ids[node.right]
            graph.add_edge(node_id, right_id)
            add_edges_for_expression_tree(graph, node.right, pos, node_ids, x + x_spacing / (2 ** level), y - 1, level + 1, x_spacing)

def draw_expression_tree(root):
    """Draws the binary expression tree with correct alignment."""
    if not root:
        return None
    
    graph = nx.DiGraph()
    pos = {}
    
    # Assign unique node identifiers using their object reference
    node_ids = {}
    def assign_ids(node, count=[0]):
        if node:
            node_ids[node] = f"{node.value}_{count[0]}"  # Create a unique ID
            count[0] += 1
            assign_ids(node.left, count)
            assign_ids(node.right, count)
    
    assign_ids(root)  # Assign unique IDs before drawing
    
    add_edges_for_expression_tree(graph, root, pos, node_ids)
    
    # Create a mapping for labels, stripping the unique ID from display
    labels = {node_ids[n]: n.value for n in node_ids}
    
    plt.figure(figsize=(8, 5))
    nx.draw(graph, pos, labels=labels, 
            with_labels=True, node_size=2000, node_color="lightblue", 
            font_size=10, edge_color="gray")
    
    plt.title("Expression Tree Visualization")
    img_buf = BytesIO()
    plt.savefig(img_buf, format='png')
    img_buf.seek(0)
    img_data = base64.b64encode(img_buf.getvalue()).decode('utf-8')
    plt.close()
    
    return img_data

def generate_child_array(nodes):
    """Generates the left child-right child representation like Figure 6.42a."""
    sorted_keys = sorted(nodes.keys())
    child_array = []

    for key in sorted_keys:
        node = nodes[key]
        left = node.left.value if node.left else 0  # 0 represents NULL
        right = node.right.value if node.right else 0
        child_array.append((key, left, right))

    return child_array

def generate_pointer_array(nodes):
    """Generates the pointer representation where each node points to its left and right children."""
    sorted_keys = sorted(nodes.keys())
    pointer_array = []

    for key in sorted_keys:
        node = nodes[key]
        left = node.left.value if node.left else None
        right = node.right.value if node.right else None
        pointer_array.append((key, left, right))

    return pointer_array

def solve(input, choice):
    """
    Main entry point for tree to array conversion.
    
    Args:
        input (str): Input string (comma-separated tree nodes or math expression)
        choice (int): 1 for regular binary tree, 2 for math expression tree
    
    Returns:
        str: JSON string containing tree visualization and array representations
    """
    result = {}
    
    try:
        if choice == 1:
            # Regular binary tree
            root, nodes = build_tree_from_input(input)
            
            if root:
                # Generate tree visualization
                image_data = draw_tree(root)

                # Draw a pointer diagram
                pointer_diagram = create_pointer_diagram(nodes)
                
                # Generate array representations
                child_array = generate_child_array(nodes)
                pointer_array = generate_pointer_array(nodes)
                
                # Format arrays for JSON
                child_array_json = [{"node": row[0], "leftChild": row[1], "rightChild": row[2]} for row in child_array]
                pointer_array_json = [{"node": row[0], "leftPointer": row[1], "rightPointer": row[2]} for row in pointer_array]
                
                result = {
                    "success": True,
                    "type": "regular_binary_tree",
                    "image": image_data,
                    "pointerDiagram": pointer_diagram,
                    "childArray": child_array_json,
                    "pointerArray": pointer_array_json
                }
            else:
                result = {
                    "success": False,
                    "type": "regular_binary_tree",
                    "error": "Failed to build tree. Check your input format."
                }
        
        elif choice == 2:
            # Mathematical expression tree
            tokens = tokenize(input)
            postfix_tokens = to_postfix(tokens)
            root, nodes = build_expression_tree(postfix_tokens)
            
            if root:
                # Generate tree visualization
                image_data = draw_expression_tree(root)

                # Create a pointer diagram
                pointer_diagram = create_pointer_diagram(nodes)
                
                # Generate array representations
                child_array = generate_child_array(nodes)
                pointer_array = generate_pointer_array(nodes)
                
                # Format arrays for JSON
                child_array_json = [{"node": row[0], "leftChild": row[1], "rightChild": row[2]} for row in child_array]
                pointer_array_json = [{"node": row[0], "leftPointer": row[1], "rightPointer": row[2]} for row in pointer_array]
                
                result = {
                    "success": True,
                    "type": "expression_tree",
                    "image": image_data,
                    "pointerDiagram": pointer_diagram,
                    "childArray": child_array_json,
                    "pointerArray": pointer_array_json
                }
            else:
                result = {
                    "success": False,
                    "type": "expression_tree",
                    "error": "Failed to build expression tree. Check your input format."
                }
        
        else:
            result = {
                "success": False,
                "error": "Invalid choice. Must be 1 (regular tree) or 2 (expression tree)."
            }
    
    except Exception as e:
        result = {
            "success": False,
            "error": f"An error occurred: {str(e)}"
        }
    
    return json.dumps(result)

def create_pointer_diagram(nodes):
    """
    Creates a visualization where each node has three squares:
    - Left square: node value
    - Middle square: left child pointer
    - Right square: right child pointer
    """
    # Sort the keys to maintain order
    sorted_keys = list(nodes.keys())
    num_nodes = len(sorted_keys)
    
    # Create figure with appropriate size
    fig_height = max(4, num_nodes * 1.5)
    fig_width = 14
    fig, ax = plt.subplots(figsize=(fig_width, fig_height))
    
    # Parameters for node layout
    node_width = 1.2 
    node_height = 1.0
    vertical_gap = 1.8 
    
    # First pass: position the nodes more efficiently
    node_positions = {}
    for i, key in enumerate(sorted_keys):
        # Position nodes with less margin
        x = 0.7
        y = (num_nodes - i - 1) * vertical_gap + 0.5 
        node_positions[key] = (x, y)
    
    # Second pass: draw the nodes with their three squares
    for key in sorted_keys:
        node = nodes[key]
        x, y = node_positions[key]
        
        # Draw the three connected squares
        # 1. Value square (left)
        value_rect = plt.Rectangle((x, y), node_width, node_height, 
                            fc='#d0e8f2', ec='black', lw=2.0) 
        ax.add_patch(value_rect)
        ax.text(x + node_width/2, y + node_height/2, str(key),
                ha='center', va='center', fontweight='bold', fontsize=14) 
        
        # 2. Left pointer square (middle)
        left_rect = plt.Rectangle((x + node_width, y), node_width, node_height, 
                            fc='#f2e4d0', ec='black', lw=2.0)
        ax.add_patch(left_rect)
        
        if node.left:
            left_value = node.left.value
            ax.text(x + node_width*1.5, y + node_height/2, str(left_value),
                   ha='center', va='center', fontsize=12, color='blue')  
        else:
            # Draw a dot for NULL
            ax.plot(x + node_width*1.5, y + node_height/2, 'ko', markersize=6)
        
        # 3. Right pointer square (right)
        right_rect = plt.Rectangle((x + node_width*2, y), node_width, node_height, 
                            fc='#f2d0d0', ec='black', lw=2.0)
        ax.add_patch(right_rect)
        
        if node.right:
            right_value = node.right.value
            ax.text(x + node_width*2.5, y + node_height/2, str(right_value),
                   ha='center', va='center', fontsize=12, color='red')
        else:
            # Draw a dot for NULL
            ax.plot(x + node_width*2.5, y + node_height/2, 'ko', markersize=6)
    
    # Third pass: draw arrows - SAME AS BEFORE
    for key in sorted_keys:
        node = nodes[key]
        parent_x, parent_y = node_positions[key]
        
        # Draw arrow from left pointer to left child
        if node.left:
            try:
                left_value = node.left.value
                if left_value in node_positions:
                    child_x, child_y = node_positions[left_value]
                    start_x = parent_x + node_width * 1.5
                    start_y = parent_y
                    end_x = child_x + node_width / 2
                    end_y = child_y + node_height
                    
                    ax.annotate('', 
                            xy=(end_x, end_y), 
                            xytext=(start_x, start_y),
                            arrowprops=dict(arrowstyle='->', color='blue', lw=2.0,
                                        connectionstyle='angle3,angleA=0,angleB=90'))
            except Exception as e:
                print(f"ERROR drawing left arrow for {key}: {e}")
        
        # Draw arrow from right pointer to right child
        if node.right:
            try:
                right_value = node.right.value
                if right_value in node_positions:
                    child_x, child_y = node_positions[right_value]
                    start_x = parent_x + node_width * 2.5
                    start_y = parent_y
                    end_x = child_x + node_width / 2
                    end_y = child_y + node_height
                    
                    ax.annotate('', 
                            xy=(end_x, end_y), 
                            xytext=(start_x, start_y),
                            arrowprops=dict(arrowstyle='->', color='red', lw=2.0,
                                        connectionstyle='angle3,angleA=0,angleB=90'))
            except Exception as e:
                print(f"ERROR drawing right arrow for {key}: {e}")
    
    # Add a legend for the squares
    value_patch = plt.Rectangle((0, 0), 1, 1, fc='#d0e8f2', ec='black')
    left_patch = plt.Rectangle((0, 0), 1, 1, fc='#f2e4d0', ec='black')
    right_patch = plt.Rectangle((0, 0), 1, 1, fc='#f2d0d0', ec='black')
    ax.legend([value_patch, left_patch, right_patch],
            ['Node Value', 'Left Child Pointer', 'Right Child Pointer'],
            loc='upper right', bbox_to_anchor=(0.98, 0.98))
    
    max_y = max([pos[1] + node_height for pos in node_positions.values()]) + 1
    max_x = 1.5 + node_width * 3.5 
    
    ax.set_xlim(0, max_x)
    ax.set_ylim(0, max_y)
    ax.axis('off')
    ax.set_title("Pointer Representation", fontsize=16, pad=10) 

    img_buf = BytesIO()
    plt.savefig(img_buf, format='png', dpi=150, 
                bbox_inches='tight',
                pad_inches=0.2)  
    img_buf.seek(0)
    img_data = base64.b64encode(img_buf.getvalue()).decode('utf-8')
    plt.close()

    return img_data