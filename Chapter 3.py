#CHAPTER 3

'''
# Example 1
def fibonacci(n):
    """
    Calculate the nth Fibonacci number using recursion.

    :param n: The position in the Fibonacci sequence (0-indexed).
    :return: The nth Fibonacci number.
    """
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    else:
        return fibonacci(n - 1) + fibonacci(n - 2)

# Example usage
if __name__ == "__main__":
    try:
        num = int(input("Enter a non-negative integer: "))
        if num < 0:
            print("Please enter a non-negative integer.")
        else:
            result = fibonacci(num)
            print(f"The {num}th Fibonacci number is: {result}")
    except ValueError:
        print("Invalid input. Please enter a valid integer.")

'''
'''
# Program to output a specific f(n) number
def evaluate_recursive(formula, base_case, n):
    """
    Evaluates a recursive formula for a given input n.

    :param formula: The recursive formula as a string, e.g., "2 * f(n-1) + 1"
    :param base_case: A dictionary representing the base case(s), e.g., {0: 1}
    :param n: The value of n to calculate f(n) for.
    :return: The result of f(n).
    """
    # Memoization to store computed values
    memo = {}

    def f(n):
        # Check if n is in the base case
        if n in base_case:
            return base_case[n]
        
        # Check if n is already computed
        if n in memo:
            return memo[n]

        # Safely evaluate the formula using eval
        result = eval(formula, {"n": n, "f": f})
        memo[n] = result
        return result

    return f(n)


if __name__ == "__main__":
    print("This program will output a specific f(n) number in the sequence.")

    try:
        # Get the recursive formula from the user
        print("Enter your recursive formula in terms of n and f(n-1). Use 'f(n-1)', 'f(n-2)', etc. for recursion.")
        formula = input("Recursive formula (e.g., '2 * f(n-1) + 1'): ").strip()

        # Get base cases from the user
        base_case = {}
        print("Now, define your base cases.")
        while True:
            key = input("Enter the value of n for the base case (or 'done' to finish): ").strip()
            if key.lower() == 'done':
                break
            try:
                key = int(key)
                value = float(input(f"Enter f({key}): "))
                base_case[key] = value
            except ValueError:
                print("Invalid input. Please enter integer keys and numeric values.")

        # Get the value of n to compute
        n = int(input("Enter the value of n to compute f(n): "))

        # Calculate and display the result
        result = evaluate_recursive(formula, base_case, n)
        print(f"The result of f({n}) is: {result}")

    except Exception as e:
        print(f"An error occurred: {e}")
'''

# Homework problems 1-12
def evaluate_recursive(formula, base_case, n):
    """
    Evaluates a recursive formula for a given input n and prints all values from the base case to n.

    :param formula: The recursive formula as a string, e.g., "2 * f(n-1) + 1"
    :param base_case: A dictionary representing the base case(s), e.g., {0: 1}
    :param n: The value of n to calculate f(n) for.
    :return: A list of results from f(0) to f(n).
    """
    # Memoization to store computed values
    memo = {}

    def f(n):
        # Check if n is in the base case
        if n in base_case:
            return base_case[n]
        
        # Check if n is already computed
        if n in memo:
            return memo[n]

        # Safely evaluate the formula using eval
        result = eval(formula, {"n": n, "f": f})
        memo[n] = result
        return result

    # Compute all values from 0 to n (or the smallest base case to n)
    min_base = min(base_case.keys())
    results = [f(i) for i in range(min_base, n + 1)]
    return results

if __name__ == "__main__":
    print("This program will output a list of numbers from f(0) to user inputted f(n).")

    try:
        # Get the recursive formula from the user
        print("Enter your recursive formula in terms of n and f(n-1). Use 'f(n-1)', 'f(n-2)', etc. for recursion.")
        formula = input("Recursive formula (e.g., '2 * f(n-1) + 1'): ").strip()

        # Get base cases from the user
        base_case = {}
        print("Now, define your base cases.")
        while True:
            key = input("Enter the value of n for the base case (or 'done' to finish): ").strip()
            if key.lower() == 'done':
                break
            try:
                key = int(key)
                value = float(input(f"Enter f({key}): "))
                base_case[key] = value
            except ValueError:
                print("Invalid input. Please enter integer keys and numeric values.")

        # Get the value of n to compute
        n = int(input("Enter the value of n to compute f(n): "))

        # Calculate and display the result
        results = evaluate_recursive(formula, base_case, n)
        print("The results from f(min_base) to f(n) are:")
        for i, value in enumerate(results, start=min(base_case.keys())):
            print(f"f({i}) = {value}")

    except Exception as e:
        print(f"An error occurred: {e}")

