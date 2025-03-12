#Chapter 6.2
#Part 2
import re
from collections import deque
import networkx as nx
import matplotlib.pyplot as plt
from io import BytesIO
import base64

def solve(input, choice):
    class Node:
        def __init__(self, value):
            self.value = value
            self.left = None
            self.right = None

    def build_tree_from_input(input_str):
        """Builds a binary tree from level-order user input."""
        values = input_str.split(',') # ("Enter node values in level order (use 'None' for empty nodes, space-separated): ").split()
        values = [v.strip() for v in values]

        if not values or values[0] == 'None':
            return None
        
        root = Node(values[0])
        queue = deque([root])
        i = 1
        nodes = {values[0]: root}  # Map values to nodes

        while i < len(values):
            current = queue.popleft()

            # Left child
            if values[i] != 'None':
                current.left = Node(values[i])
                nodes[values[i]] = current.left
                queue.append(current.left)
            i += 1

            # Right child
            if i < len(values) and values[i] != 'None':
                current.right = Node(values[i])
                nodes[values[i]] = current.right
                queue.append(current.right)
            i += 1

        return root, nodes

    def generate_child_array(nodes):
        """Generates the left child-right child representation like Figure 6.42a."""
        sorted_keys = sorted(nodes.keys())  # Sort keys for consistent order
        child_array = []

        for key in sorted_keys:
            node = nodes[key]
            left = node.left.value if node.left else 0  # 0 represents NULL
            right = node.right.value if node.right else 0
            child_array.append((key, left, right))

        return child_array

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
        graph = nx.DiGraph()
        pos = {}
        add_edges(graph, root, pos)
        plt.figure(figsize=(6, 4))
        nx.draw(graph, pos, with_labels=True, node_size=2000, node_color="lightblue", font_size=10, edge_color="gray")
        plt.title("Graph Visualization")
        img_buf = BytesIO()
        plt.savefig(img_buf, format='png')
        img_buf.seek(0)
        img_data = base64.b64encode(img_buf.getvalue()).decode('utf-8')
        print(img_data)
        plt.close()
        return img_data
        #plt.show()

    def generate_pointer_array(nodes):
        """Generates the pointer representation where each node points to its left and right children."""
        sorted_keys = sorted(nodes.keys())  # Sort keys for consistent order
        pointer_array = []

        for key in sorted_keys:
            node = nodes[key]
            left = node.left.value if node.left else None  # None represents NULL
            right = node.right.value if node.right else None
            pointer_array.append((key, left, right))

        return pointer_array

    def tokenize(expression):
        """Tokenizes an expression, handling implicit multiplication."""
        expression = expression.replace(" ", "")
        
        # Handle implicit multiplication: 3(x+y) → 3*(x+y)
        expression = re.sub(r'(\d)([a-zA-Z(])', r'\1*\2', expression)
        expression = re.sub(r'(\))(\d|[a-zA-Z])', r'\1*\2', expression)

        # Tokenize: Match numbers, variables, operators, and parentheses
        tokens = re.findall(r'\d+|[a-zA-Z]+|[+\-*/^()]', expression)
        
        print("Tokenized Expression:", tokens)
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
                while stack and precedence(stack[-1]) >= precedence(token):
                    output.append(stack.pop())
                stack.append(token)

        while stack:
            output.append(stack.pop())

        print("Postfix Expression:", output)
        return output

    def build_expression_tree(postfix_tokens):
        """Builds an expression tree from postfix notation."""
        stack = []
        nodes = {}  # Dictionary to store nodes if needed

        for token in postfix_tokens:
            node = Node(token)
            nodes[token] = node  # Store node in dictionary

            if token in "+-*/^":  # Operator
                if len(stack) < 2:
                    print(f"Error: Not enough operands for operator '{token}'")
                    return None, {}

                node.right = stack.pop()  # First pop is right child
                node.left = stack.pop()   # Second pop is left child

            stack.append(node)

        if len(stack) != 1:
            print("Error: Invalid postfix expression. Stack:", [n.value for n in stack])
            return None, {}

        print("Expression tree successfully built!")
        return stack[0], nodes  # Return both root and dictionary


    def print_tree(node, level=0, side="Root"):
        """Recursively prints the tree structure."""
        if node:
            print("  " * level + f"{side}: {node.value}")
            print_tree(node.left, level + 1, "L")
            print_tree(node.right, level + 1, "R")

    def add_edges2(graph, node, pos, node_ids, x=0, y=0, level=1, x_spacing=1.5):
        """Recursively adds edges to the graph and positions nodes uniquely."""
        if node:
            node_id = node_ids[node]  # Get the unique ID for this node
            pos[node_id] = (x, y)  # Assign position
            
            if node.left:
                left_id = node_ids[node.left]
                graph.add_edge(node_id, left_id)
                add_edges2(graph, node.left, pos, node_ids, x - x_spacing / (2 ** level), y - 1, level + 1, x_spacing)

            if node.right:
                right_id = node_ids[node.right]
                graph.add_edge(node_id, right_id)
                add_edges2(graph, node.right, pos, node_ids, x + x_spacing / (2 ** level), y - 1, level + 1, x_spacing)

    def draw_expression_tree(root):
            """Draws the binary expression tree with correct alignment."""
            if not root:
                print("No tree to draw.")
                return

            graph = nx.DiGraph()
            pos = {}

            # Assign unique node identifiers using their object reference
            node_ids = {}
            def assign_ids(node, count=[0]):  # Use a mutable default argument to keep track
                if node:
                    node_ids[node] = f"{node.value}_{count[0]}"  # Create a unique ID
                    count[0] += 1
                    assign_ids(node.left, count)
                    assign_ids(node.right, count)

            assign_ids(root)  # Assign unique IDs before drawing

            add_edges2(graph, root, pos, node_ids)

            # Create a mapping for labels, stripping the unique ID from display
            labels = {node_ids[n]: n.value for n in node_ids}

            plt.figure(figsize=(8, 5))
            nx.draw(graph, pos, labels=labels, 
                    with_labels=True, node_size=2000, node_color="lightblue", 
                    font_size=10, edge_color="gray")

            print("Displaying expression tree...")
            plt.title("Graph Visualization")
            img_buf = BytesIO()
            plt.savefig(img_buf, format='png')
            img_buf.seek(0)
            img_data = base64.b64encode(img_buf.getvalue()).decode('utf-8')
            print(img_data)
            plt.close()
            return img_data
            #plt.show(block=True)

    # print("Choose Input Method:")
    # print("1. Regular")
    # print("2. Mathematical Expression")
    # choice = int(input("Enter choice (1/2): "))
    
    if choice == 1:
        # Example Usage:
        root, nodes = build_tree_from_input(input)
        if root:
            draw_tree(root)
            child_array = generate_child_array(nodes)
            pointer_array = generate_pointer_array(nodes)

            print("\nLeft Child - Right Child Array Representation:")
            print(" Node | Left Child | Right Child ")
            print("-------------------------------")
            for row in child_array:
                print(f"  {row[0]:^4} |    {row[1]:^7}  |    {row[2]:^7}  ")

            print("\nPointer Representation:")
            print(" Node | Left Pointer | Right Pointer ")
            print("-------------------------------------")
            for row in pointer_array:
                # Ensure that None is displayed properly if it's missing
                left_pointer = "None" if row[1] is None else row[1]
                right_pointer = "None" if row[2] is None else row[2]
                print(f"  {row[0]:^4} |     {left_pointer:^7}     |     {right_pointer:^7}    ")
        else:
            print("Tree is empty.")
    elif choice == 2:
        #expression = input("Enter a mathematical expression: ")
        tokens = tokenize(input)
        postfix_tokens = to_postfix(tokens)
        root, nodes = build_expression_tree(postfix_tokens)
        if root:
            draw_expression_tree(root)
            child_array = generate_child_array(nodes)
            pointer_array = generate_pointer_array(nodes)

            print("\nLeft Child - Right Child Array Representation:")
            print(" Node | Left Child | Right Child ")
            print("-------------------------------")
            for row in child_array:
                print(f"  {row[0]:^4} |    {row[1]:^7}  |    {row[2]:^7}  ")

            print("\nPointer Representation:")
            print(" Node | Left Pointer | Right Pointer ")
            print("-------------------------------------")
            for row in pointer_array:
                # Ensure that None is displayed properly if it's missing
                left_pointer = "None" if row[1] is None else row[1]
                right_pointer = "None" if row[2] is None else row[2]
                print(f"  {row[0]:^4} |     {left_pointer:^7}     |     {right_pointer:^7}    ")
        else:
            print("Tree is empty.")
    else:
        print("Invalid input")

input = ("A, B, C, D, E, None, F")
choice = 1
# expression = ""
solve(input, choice)
input = "2+(3+5-7)"
choice = 2
solve(input, choice)

