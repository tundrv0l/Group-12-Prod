import re
import networkx as nx
import matplotlib.pyplot as plt
from collections import deque
from io import BytesIO
import base64
def solve(input1, input2, choice):
    class Node:
        def __init__(self, value):
            self.value = value
            self.left = None
            self.right = None

    #1
    def build_tree_from_input(input):
        """Builds a binary tree from level-order user input."""
        values = input.split() #("Enter node values in level order (use 'None' for empty nodes, space-separated): ").split()
        
        if not values or values[0] == 'None':
            return None, {}

        root = Node(int(values[0]))
        queue = deque([root])
        i = 1
        nodes = {int(values[0]): root}  # Map values to nodes

        while i < len(values):
            current = queue.popleft()

            # Left child
            if values[i] != 'None':
                current.left = Node(int(values[i]))
                nodes[int(values[i])] = current.left
                queue.append(current.left)
            i += 1

            # Right child
            if i < len(values) and values[i] != 'None':
                current.right = Node(int(values[i]))
                nodes[int(values[i])] = current.right
                queue.append(current.right)
            i += 1

        return root, nodes

    # 2. LEFT-CHILD RIGHT-CHILD TABLE METHOD
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

    # 3. BUILD TREE FROM PREORDER & INORDER
    def build_tree_from_pre_in(preorder, inorder):
        if not preorder or not inorder:
            return None

        root_value = preorder.pop(0)
        root = Node(root_value)
        index = inorder.index(root_value)

        root.left = build_tree_from_pre_in(preorder, inorder[:index])
        root.right = build_tree_from_pre_in(preorder, inorder[index+1:])
        return root

    # 4. BUILD TREE FROM POSTORDER & INORDER
    def build_tree_from_post_in(postorder, inorder):
        if not postorder or not inorder:
            return None

        root_value = postorder.pop()
        root = Node(root_value)
        index = inorder.index(root_value)

        root.right = build_tree_from_post_in(postorder, inorder[index+1:])
        root.left = build_tree_from_post_in(postorder, inorder[:index])
        return root

    # 5. TREE TRAVERSALS
    def preorder_traversal(root):
        return [root.value] + preorder_traversal(root.left) + preorder_traversal(root.right) if root else []

    def inorder_traversal(root):
        return inorder_traversal(root.left) + [root.value] + inorder_traversal(root.right) if root else []

    def postorder_traversal(root):
        return postorder_traversal(root.left) + postorder_traversal(root.right) + [root.value] if root else []

    # 7. DRAW TREE
    def add_edges(graph, root, pos, x=0, y=0, level=1):
        """Recursively add edges for visualization."""
        if root:
            pos[root.value] = (x, y)
            if root.left:
                graph.add_edge(root.value, root.left.value)
                add_edges(graph, root.left, pos, x - 1 / 2**level, y - 1, level + 1)
            if root.right:
                graph.add_edge(root.value, root.right.value)
                add_edges(graph, root.right, pos, x + 1 / 2**level, y - 1, level + 1)

    def draw_tree(root):
        """Draws the binary tree."""
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

        for token in postfix_tokens:
            node = Node(token)

            if token in "+-*/^":  # Operator
                if len(stack) < 2:
                    print(f"Error: Not enough operands for operator '{token}'")
                    return None

                node.right = stack.pop()  # First pop is right child
                node.left = stack.pop()   # Second pop is left child

            stack.append(node)

        if len(stack) != 1:
            print("Error: Invalid postfix expression. Stack:", [n.value for n in stack])
            return None

        print("Expression tree successfully built!")
        return stack[0]


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
                with_labels=True, node_size=500, node_color="lightblue", 
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

    if choice == 1:
        root, nodes = build_tree_from_input(input1)
    elif choice == 2:
        root, nodes = build_tree_from_table(input1)
    elif choice == 3:
        preorder = input1.split() # ("Enter Preorder Traversal: ").split()
        inorder = input2.split() # ("Enter Inorder Traversal: ").split()
        root = build_tree_from_pre_in(preorder, inorder)
        nodes = {}  # Traversal methods don't track child nodes
    elif choice == 4:
        postorder = input1.split() # ("Enter Preorder Traversal: ").split()
        inorder = input2.split() # ("Enter Inorder Traversal: ").split()
        root = build_tree_from_post_in(postorder, inorder)
        nodes = {}  # Traversal methods don't track child nodes
    elif choice == 5:
        tokens = tokenize(input1)
        postfix_tokens = to_postfix(tokens)
        root = build_expression_tree(postfix_tokens)
        if root:
            print("\nExpression Tree Structure:")
            #print_tree(root)  # Debugging: Print tree structure
            draw_expression_tree(root)
        else:
            print("Failed to build expression tree.")
        #root, nodes = build_tree_from_input2(input1)
    else:
        print("Invalid choice.")
        return

    if root:
        print("\nBinary Tree Constructed! Visualizing...\n")
        if choice != 5:
            draw_tree(root)

        print("Preorder Traversal:", preorder_traversal(root))
        print("Inorder Traversal:", inorder_traversal(root))
        print("Postorder Traversal:", postorder_traversal(root))

        # if nodes:
        #     child_array = generate_child_array(nodes)
        #     print("\nLeft Child - Right Child Array Representation:")
        #     print(" Node | Left Child | Right Child ")
        #     print("-------------------------------")
        #     for row in child_array:
        #         print(f"  {row[0]:^4} |    {row[1]:^7}  |    {row[2]:^7}  ")
    else:
        print("Tree is empty.")

#-----------Example Inputs------------
emptyInput = ""
input1 = "1 2 3 4 5 6"
input2 = [
    "1 2 3",
    "2 0 0",
    "3 0 0"
]
input3_1 = "1 2 3 4 5 6"
input3_2 = "1 2 3 4 5 6"
input4_1 = "1 2 3 4 + 6"
input4_2 = "1 2 3 4 + 6"
input5 = "2*x*(3+5*4)"
solve(input1, emptyInput, choice = 1)
solve(input2, emptyInput, choice = 2)
solve(input3_1, input3_2, choice = 3)
solve(input4_1, input4_2, choice = 4)
solve(input5, emptyInput, choice = 5)


# ------------------NOTES-------------------
    # Helper functions for parsing the expression
    # def is_operator(c):
    #     return c in '+-*/^'

    # def precedence(op):
    #     if op in ('+', '-'):
    #         return 1
    #     if op in ('*', '/'):
    #         return 2
    #     if op == '^':
    #         return 3
    #     return 0

    # def infix_to_postfix(expression):
    #     """Converts an infix expression to a postfix expression."""
    #     stack = []
    #     postfix = []
    #     for char in expression:
    #         if char.isdigit():
    #             postfix.append(char)
    #         elif char == '(':
    #             stack.append(char)
    #         elif char == ')':
    #             while stack and stack[-1] != '(':
    #                 postfix.append(stack.pop())
    #             stack.pop()  # Pop '('
    #         elif is_operator(char):
    #             while (stack and precedence(stack[-1]) >= precedence(char)):
    #                 postfix.append(stack.pop())
    #             stack.append(char)
        
    #     while stack:
    #         postfix.append(stack.pop())
        
    #     return postfix

    # def build_expression_tree(postfix):
    #     """Builds an expression tree from the postfix expression."""
    #     stack = []
    #     for char in postfix:
    #         if char.isdigit():
    #             stack.append(Node(char))
    #         elif is_operator(char):
    #             right = stack.pop()
    #             left = stack.pop()
    #             node = Node(char)
    #             node.left = left
    #             node.right = right
    #             stack.append(node)
        
    #     return stack[-1]  # The root of the expression tree

    # 1. LEVEL ORDER INPUT METHOD
    # def build_tree_from_input2(input_data):
    #     """Builds a binary expression tree from a mathematical expression."""
    #     expression = input_data #("Enter a mathematical expression (use space between operators and operands): ")
        
    #     # Remove spaces and handle invalid characters
    #     #expression = ''.join(expression.split())
        
    #     if not expression:
    #         return None, {}
        
        

    #     # Convert to postfix notation
    #     #postfix = infix_to_postfix(expression)
        
    #     # Build the tree from postfix
    #     #root = build_expression_tree(postfix)
        
    #     return root, {}

# if __name__ == "__main__":
#     main()


    # 8. MAIN PROGRAM
    #def main():
        # print("Choose Input Method:")
        # print("1. Level-Order Input")
        # print("2. Left-Child Right-Child Table")
        # print("3. Preorder & Inorder")
        # print("4. Postorder & Inorder")
        # print("5. Mathematical Expression Input")

        #choice = int(input("Enter choice (1/2/3/4/5): "))


    # # 6. GENERATE LEFT-CHILD RIGHT-CHILD TABLE
    # def generate_child_array(nodes):
    #     """Generates the left child-right child representation."""
    #     sorted_keys = sorted(nodes.keys())
    #     child_array = []

    #     for key in sorted_keys:
    #         node = nodes[key]
    #         left = node.left.value if node.left else 0  # 0 represents NULL
    #         right = node.right.value if node.right else 0
    #         child_array.append((key, left, right))

    #     return child_array