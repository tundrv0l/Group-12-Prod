import re
import cmath

def parse_table_input(set_input, table_input):
    print("Enter elements of set S (space-separated):")
    S = set(set_input.split())
    
    print("Enter binary operation table row by row, with space-separated values:")
    table = table_input
    # for _ in range(len(S)):
    #     row = table_input.split()
    #     table.append(row)
    
    return S, table

def is_binary_operation(S, table):
    if len(table) != len(S) or any(len(row) != len(S) for row in table):
        return False  # The table must be square and match the size of S
    
    for row in table:
        for value in row:
            if value not in S:
                return False  # Outputs must be within the set S
    return True

def is_unary_operation(S, table):
    if len(table) != len(S) or any(len(row) != 1 for row in table):
        return False  # A unary operation has exactly one output per input
    
    for row in table:
        if row[0] not in S:
            return False  # Outputs must be within the set S
    return True

def parse_expression_input(expression):
    expr = expression # input("Enter an operation expression (e.g., x# = x^2; S = Z): ")
    match = re.match(r"(.+)\s*=\s*(.+);\s*S\s*=\s*(.+)", expr)
    if not match:
        print("Invalid format. Use 'x# = x^2; S = Z' or 'x ⊕ y = (x + y) % 3; S = {0,1,2}'")
        return None, None, None
    
    operation, expression, set_definition = match.groups()
    
    # Determine if unary or binary
    variables = re.findall(r'\b[a-zA-Z]\b', expression)
    #numbers = re.findall(r'\b\d+\b', expression)
    op_type = "binary" if len(variables)> 1 else "unary"
    
    return set_definition, expression, op_type

def check_domain(set_definition, expression, op_type):
    sample_inputs = list(range(-5, 6))  # Sample values from -5 to 5
    
    try:
        if set_definition == "N":
            for x in sample_inputs:
                result = eval(expression.replace("x", str(x)))
                if not (isinstance(result, int) and result >= 0):
                    return False
        elif set_definition == "Z":
            for x in sample_inputs:
                result = eval(expression.replace("x", str(x)))
                if not isinstance(result, int):
                    return False
        elif set_definition == "Q":
            for x in sample_inputs:
                result = eval(expression.replace("x", str(x)))
                if not isinstance(result, (int, float)) or (isinstance(result, float) and result % 1 != 0 and result.as_integer_ratio()[1] == 1):
                    return False
        elif set_definition == "R":
            if "i" in expression or "sqrt(-1)" in expression:
                return False
        elif set_definition == "C":
            if "i" in expression or "sqrt(-1)" in expression:
                return True
            return False
        return True
    except Exception:
        return False

def solve(choice_input, set_input, table_input, expr_input):
    choice = choice_input #input("Choose input type (1: Table, 2: Expression): ")
    if choice == "1":
        S, table = parse_table_input(set_input, table_input)
        if is_binary_operation(S, table):
            print("The operation is a binary operation on S.")
        elif is_unary_operation(S, table):
            print("The operation is a unary operation on S.")
        else:
            print("The operation is neither a valid binary nor unary operation on S.")
    elif choice == "2":
        set_definition, expression, op_type = parse_expression_input(expr_input)
        if set_definition is not None:
            if check_domain(set_definition, expression, op_type):
                print(f"The operation is a {op_type} operation on {set_definition}.")
            else:
                print("The operation is not well-defined on the given set.")
    else:
        print("Invalid choice.")
        
choice = "1"
set_S = "1 2 3"
table = [
    ['1', '2', '3'],
    ['1', '2', '3'],
    ['1', '2', '3']
]
expr = ""
solve(choice, set_S, table, expr)
choice = "2"
set_S = ""
table = []
expr = "x# = x^2; S = Z"
solve(choice, set_S, table, expr)
