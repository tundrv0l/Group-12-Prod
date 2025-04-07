'''----------------- 
# Title: binary_unary_solver.py
# Author: Michael Lowder
# Date: 4/3/2025
# Description: A solver for identifying Binary/Unary relations
-----------------'''

import re
import json
import os
import sys
# Append the parent directory to the path so we can import in utility
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from solvers.util.exceptions import CalculateError

def parse_table_input(set_input, table_input):
    S = set(set_input.split())
    table = table_input
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
    match = re.match(r"(.+)\s*=\s*(.+);\s*S\s*=\s*(.+)", expression)
    if not match:
        raise CalculateError("Invalid format. Use 'x# = x^2; S = Z' or 'x ⊕ y = (x + y) % 3; S = {0,1,2}'")
    
    operation, expression, set_definition = match.groups()
    
    # Determine if unary or binary
    variables = re.findall(r'\b[a-zA-Z]\b', expression)
    op_type = "binary" if len(variables) > 1 else "unary"
    
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

def format_readable_output(result):
    """Convert the result dictionary to a readable string output."""
    output = f"Operation Type: {result['operation_type']}\n"
    output += f"Well-defined: {'Yes' if result['is_well_defined'] else 'No'}\n\n"
    
    if result["properties"]:
        output += "Properties:\n"
        for prop in result["properties"]:
            output += f"• {prop}\n"
    
    # Add explanatory text based on operation type
    if result["is_well_defined"]:
        if "Binary" in result["operation_type"]:
            output += "\nA binary operation takes two inputs from a set and returns a value in the same set."
        elif "Unary" in result["operation_type"]:
            output += "\nA unary operation takes one input from a set and returns a value in the same set."
    else:
        output += "\nAn operation is well-defined when all outputs are elements of the set."
    
    return output

def solve(choice_input, set_input, table_input, expr_input):
    """Main solve function for binary/unary operations"""
    try:
        result = {
            "operation_type": None,
            "is_well_defined": False,
            "properties": []
        }
        
        if choice_input == "1":
            # Table input mode
            if not set_input or not set_input.strip():
                raise CalculateError("Please enter elements for the set.")
                
            S, table = parse_table_input(set_input, table_input)
            
            if not S:
                raise CalculateError("The set cannot be empty.")
                
            if is_binary_operation(S, table):
                result["operation_type"] = "Binary Operation"
                result["is_well_defined"] = True
                result["properties"] = [f"This is a binary operation on the set {{{', '.join(sorted(S))}}}"]
            elif is_unary_operation(S, table):
                result["operation_type"] = "Unary Operation"
                result["is_well_defined"] = True
                result["properties"] = [f"This is a unary operation on the set {{{', '.join(sorted(S))}}}"]
            else:
                result["operation_type"] = "Invalid Operation"
                result["is_well_defined"] = False
                result["properties"] = ["The operation is neither a valid binary nor unary operation on this set"]
                
        elif choice_input == "2":
            # Expression input mode
            if not expr_input or not expr_input.strip():
                raise CalculateError("Please enter an expression.")
                
            set_definition, expression, op_type = parse_expression_input(expr_input)
            
            if check_domain(set_definition, expression, op_type):
                result["operation_type"] = f"{op_type.capitalize()} Operation"
                result["is_well_defined"] = True
                result["properties"] = [
                    f"The operation is defined by: {expression}",
                    f"This is a {op_type} operation on the set {set_definition}"
                ]
            else:
                result["operation_type"] = f"{op_type.capitalize()} Operation"
                result["is_well_defined"] = False
                result["properties"] = [
                    f"The operation is defined by: {expression}",
                    f"This operation is not well-defined on the set {set_definition}"
                ]
        else:
            raise CalculateError("Invalid choice. Please select a valid input type.")

        output_str = format_readable_output(result)
        return json.dumps({"output": output_str})
            
    except CalculateError:
        # Re-raise the CalculateError to be caught by the controller
        raise
    except Exception as e:
        # Wrap any other exceptions in a CalculateError
        raise CalculateError(f"Error: {str(e)}")