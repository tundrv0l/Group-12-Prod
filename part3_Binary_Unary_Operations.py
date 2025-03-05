import math

# Define binary operations
def binary_operations(op, left, right):
    if op == '+':
        return left + right
    elif op == '-':
        return left - right
    elif op == '*':
        return left * right
    elif op == '/':
        if right == 0:
            raise ValueError("Cannot divide by zero.")
        return left / right
    elif op == '^':
        return left ** right
    else:
        raise ValueError(f"Unsupported binary operator: {op}")

# Define unary operations
def unary_operations(op, value):
    if op == '-':  # Negation
        return -value
    elif op == '!':  # Factorial (integer only)
        if value < 0 or not value.is_integer():
            raise ValueError("Factorial is only defined for non-negative integers.")
        return math.factorial(int(value))
    elif op == 'sqrt':  # Square root
        if value < 0:
            raise ValueError("Cannot take the square root of a negative number.")
        return math.sqrt(value)
    else:
        raise ValueError(f"Unsupported unary operator: {op}")

# Example usage
try:
    # Binary operation example
    result = binary_operations('+', 3, 4)  # 3 + 4
    print(f"Binary result: {result}")

    # Unary operation example
    result = unary_operations('-', 5)  # -5
    print(f"Unary result (negation): {result}")

    # Unary operation example for factorial
    result = unary_operations('!', 5)  # 5!
    print(f"Unary result (factorial): {result}")
    
except ValueError as e:
    print(f"Error: {e}")


import operator
import math

# Binary operations dictionary
binary_operations = {
    '+': operator.add,
    '-': operator.sub,
    '*': operator.mul,
    '/': operator.truediv,
    '^': operator.pow
}

# Unary operations dictionary
unary_operations = {
    '-': operator.neg,
    'sin': math.sin,
    'cos': math.cos,
    'tan': math.tan,
    'sqrt': math.sqrt
}

# Function to handle binary operations
def apply_binary_operator(left, operator, right):
    if operator in binary_operations:
        return binary_operations[operator](left, right)
    else:
        raise ValueError(f"Unsupported binary operator: {operator}")

# Function to handle unary operations
def apply_unary_operator(operator, operand):
    if operator in unary_operations:
        return unary_operations[operator](operand)
    else:
        raise ValueError(f"Unsupported unary operator: {operator}")

# Example usage:
x = 5
y = 3
result_binary = apply_binary_operator(x, '+', y)  # 5 + 3
result_unary = apply_unary_operator('-', x)  # -5

print("Binary operation result (5 + 3):", result_binary)
print("Unary operation result (-5):", result_unary)

def is_binary_operation(S, operation):
    """Checks if the given operation is a binary operation on set S."""
    for x in S:
        for y in S:
            if operation(x, y) not in S:
                return False
    return True

# Define the set S for part (a) and (b)
S = {1, 2, 3}

# Define the binary operation for part (a) (assuming x#y = x*y)
def binary_op(x, y):
    return x * y  # Treating x#y as multiplication

# Define the binary operation table for part (b)
binary_table = [
    [1, 2, 3],
    [2, 3, 4],
    [3, 4, 5]
]

def table_is_binary(S, table):
    """Checks if the given table represents a binary operation on set S."""
    for row in table:
        for val in row:
            if val not in S:
                return False
    return True

# Check the binary operation for part (a)
print("Binary Operation Check (Part a):", is_binary_operation(S, binary_op))

# Check the binary operation for part (b)
print("Binary Operation Check (Part b):", table_is_binary(S, binary_table))



