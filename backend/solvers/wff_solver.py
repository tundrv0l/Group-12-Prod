'''----------------- 
# Title: wff_solver.py
# Author: Mathias Buchanan
# Date: 2/18/2025
# Description: A solver for well-formed formulas (WFF) to generate truth tables.
-----------------'''

#---Imports---#
import itertools
import re
import json

def implies (p, q):
    '''
        Function to evaluate logical implication

        Parameters
        ----------
        p (int): 
            The antecedent of the implication
        q (int):
            The consequent of the implication

        Returns
        ----------
        return: bool
            True if p implies q, False otherwise.
    '''
    return not p or q


def _parse_formula(formula):
    '''
        Function to parse a logical formula and replace logical operators 
            with Python equivalents. Does this by converting to Python syntax and evaluating the formula.

        Parameters
        ----------
        formula (str): 
            The logical formula to parse

        Returns
        ----------
        return: str
            The parsed formula with Python equivalents of logical operators.
    '''

    # Process any parenthesized expressions first
    parenthesis_pattern =  re.findall(r'\(([^()]+)\)', formula)
    for expr in parenthesis_pattern:
        parsed_expr = _parse_formula(expr.strip())
        formula = formula.replace(f"({expr})", f"({parsed_expr})")
    
    # Also process bracket expressions
    bracket_pattern = re.findall(r'\[([^\[\]]+)\]', formula)
    for expr in bracket_pattern:
        parsed_expr = _parse_formula(expr.strip())
        formula = formula.replace(f"[{expr}]", f"[{parsed_expr}]")


    # Replace characters from the book copy n paste format
    formula = formula.replace('`', ' and ')
    formula = formula.replace('~', ' or ')
    formula = formula.replace('4', ' == ')
    formula = re.sub(r"([A-Z])′", r'not \1', formula)

    # Replace unicode characters with ASCII equivalents
    formula = formula.replace('¬', 'not ')
    formula = formula.replace('∧', ' and ')
    formula = formula.replace('∨', ' or ')
    formula = formula.replace('↔', ' == ')

    formula = re.sub(r"\(([^()]+)\)\'", r'not (\1)', formula)  # ASCII apostrophe
    formula = re.sub(r"\(([^()]+)\)′", r'not (\1)', formula)   # Unicode prime symbol
    
    # Handle negation of individual variables
    formula = re.sub(r"([A-Z])\'", r'not \1', formula)
    formula = re.sub(r"([A-Z])′", r'not \1', formula)


    # Replace logical operators with Python equivalents
    formula = formula.replace('v', ' or ')
    formula = formula.replace('V', ' or ')
    formula = formula.replace('^', ' and ')
    formula = formula.replace('<>', ' == ')
    formula = re.sub(r"([A-Z])'", r'not \1', formula)

    # Handle implication operators with improved pattern matching for complex expressions
    implication_patterns = ['->', '→', '<=', '>', 'S']
    
    # Check if any implication operator exists in the formula
    has_implication = any(pattern in formula for pattern in implication_patterns)

    # Special handling of implication specifically because python hates this operation.
    if has_implication:
        
        # Track parentheses/brackets balance to find the main implication operator
        balance = 0
        implication_pos = -1
        implication_operator = None
        
        for i in range(len(formula)):
            char = formula[i]
            
            # Track parentheses/brackets balance
            if char in '([':
                balance += 1
            elif char in ')]':
                balance -= 1
            
            # Only look for implication operators at top level (balance == 0)
            if balance == 0:
                # Check for each implication pattern
                for pattern in implication_patterns:
                    if i + len(pattern) <= len(formula) and formula[i:i+len(pattern)] == pattern:
                        implication_pos = i
                        implication_operator = pattern
                        break
                
                if implication_pos != -1:
                    break
        
        # If we found an implication operator at the top level
        if implication_pos != -1:
            left_side = formula[:implication_pos].strip()
            right_side = formula[implication_pos + len(implication_operator):].strip()
            
            # Convert to implies function
            formula = f"implies({left_side}, {right_side})"

    return formula

def _extract_intermediate_expressions(formula):
    '''
        Function to extract intermediate expressions from a logical formula.
            E.g. (A and B) or (C and D) would return ['A and B', 'C and D']

        Parameters
        ----------
        formula (str): 
            The logical formula to extract intermediate expressions from

        Returns
        ----------
        return: list
            A list of intermediate expressions extracted from the formula.
    '''
    # Extract intermediate expressions from the formula
    intermediate_expressions = re.findall(r'\(([^()]+)\)', formula)
    return intermediate_expressions

def _extract_variables(formula):
    '''
        Function to extract unique variables (letters) from a logical formula.

        Parameters
        ----------
        formula (str): 
            The logical formula to extract variables from

        Returns
        ----------
        return: list
            A sorted list of unique variables extracted from the formula.
    '''
    # Extract unique variables from the formula using a regular expression
    #   (excluding V, which is a logical operator in this context)
    return sorted(set(re.findall(r'\b(?!V|S\b)[A-Z]\b', formula)))

def _post_process_formula(headers):
    '''
        Function to sub in common operators for output. Just to make it look nice.

        Parameters
        ----------
        headers (str): 
            Headers in the truth table

        Returns
        ----------
        return: headers (list)
            A list of headers for the truth table, updated with operators
            
    '''

    # Replace characters in the header with ascii equivalents
    for i in range(len(headers)):
        headers[i] = headers[i].replace('^', '∧')
        headers[i] = headers[i].replace('`', '∧')
        headers[i] = headers[i].replace('->', '→')
        headers[i] = headers[i].replace('>', '→')
        headers[i] = headers[i].replace('<>', '↔')
        headers[i] = headers[i].replace('v', '∨')
        headers[i] = headers[i].replace('V', '∨')
        headers[i] = headers[i].replace('~', '∨')
        headers[i] = headers[i].replace('<=', '→')
        headers[i] = headers[i].replace('S', '→')
        headers[i] = headers[i].replace('==', '↔')
        headers[i] = headers[i].replace('4', '↔')

    return headers

def solve(formula):
    '''
        Function to solve a logical formula and generate a truth table.

        Parameters
        ----------
        formula (str): 
            The logical formula to solve

        Returns
        ----------
        return: json
            A JSON object representing the truth table to return to the client.
    '''

    # Extract unique variables from the formula
    variables = _extract_variables(formula)

    # Extract intermediate expressions from the formula
    intermediate_expressions = _extract_intermediate_expressions(formula)

    # Generate all possible combinations of truth values for the variables
    truth_values = list(itertools.product([False, True], repeat=len(variables)))

    # Parse the formula to replace logical operators with Python equivalents
    parsed_formula = _parse_formula(formula)

    # Evaluate the formula for each combination of truth values
    results = []
    for values in truth_values:

        # Create a dictionary to map variables to their truth values
        env = dict(zip(variables, values))

        # Add the implies function to the environment
        env['implies'] = implies

        # Create a row for the truth table
        row = list(values)

        # Evaluate intermediate expressions and the main formula
        for expr in intermediate_expressions:

            # Parse the intermediate expression to replace logical operators w/ Python equivalents
            parsed_expr = _parse_formula(expr)

            # Evaluate the intermediate expression via Python's eval function
            row.append(eval(parsed_expr, {}, env))
        
        print(parsed_formula)
        # Evaluate the main formula and append it to results
        row.append(eval(parsed_formula, {}, env))
        results.append(row)

    # Generate the headers for the truth table
    headers = variables + intermediate_expressions + [formula]

    # Post process formula to conform to symbology
    headers = _post_process_formula(headers)

    # Classify the WFF based on the truth table
    classification, description = _classify_wff(results)
    
    # Prepare the truth table as a JSON object
    truth_table = {
        "headers": headers,
        "rows": [],
        "classification": classification,
        "description": description
    }

    # Add the rows to the truth table
    for row in results:
        truth_table["rows"].append(row)

    return json.dumps(truth_table)

def _classify_wff(truth_table_rows):
    """
    Classify a WFF as a tautology, contradiction, or contingency based on its truth table.
    
    Parameters
    ----------
    truth_table_rows (list): 
        List of rows from the truth table
        
    Returns
    ----------
    tuple: (classification, description)
        Classification as string and description explaining the classification
    """
    # Extract the last column of each row (the final formula evaluation)
    final_column = [row[-1] for row in truth_table_rows]
    
    # Check if all values are True
    if all(final_column):
        return ("tautology", "Formula is always true regardless of input values.")
    
    # Check if all values are False
    if not any(final_column):
        return ("contradiction", "Formula is always false regardless of input values.")
    
    # If some true and some false, it's a contingency
    true_count = sum(1 for val in final_column if val)
    false_count = len(final_column) - true_count
    return ("contingency", f"Formula is true for {true_count} combinations and false for {false_count} combinations.")