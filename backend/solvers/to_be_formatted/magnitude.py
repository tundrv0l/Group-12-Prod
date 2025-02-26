# File: magnitude.py
# Author: Jacob Warren
# Description: 5.5 stuff

import math # for logarithms

# Function: polynomial
# Input: the highest order between the polynomials as an integer and
#        the scalars of the two polynomials as lists of floats
#        with lower indices corresponding to lower order terms
# Output: the two constants and minimum value in a list
# Purpose: solve problems like 1-6
def polynomial(order, scalars_f, scalars_g):
    if scalars_g[order] == 0:
        return [0, 0, 0]

    c_1 = (1/2) * scalars_f[order] / scalars_g[order];
    c_2 = (2) * scalars_f[order] / scalars_g[order];
    
    h_1 = [scalars_f[i] - c_1 * scalars_g[i] for i in range(order)]
    h_2 = [c_2 * scalars_g[i] - scalars_f[i] for i in range(order)]

    M_1 = max(abs(h_1[i]) for i in range(order))
    M_2 = max(abs(h_2[i]) for i in range(order))

    n_0 = max(M_1 / (c_1 * scalars_g[order]), M_2 / (c_2 * scalars_g[order]))

    return [n_0, c_1, c_2]

# Function: master
# Input: values of an expression that fit the
#        requirements of the master theorem as
#        floats
# Output: the order of magnitude of the function
#         as a string
# Purpose: solve problems like 21-26
def master(a, b, c):
    if a < 1 or b <= 1 or c < 0:
        return "bad numbers"

    if a < b ** c:
        if c == 1:
            return "n"
        elif c == 0:
            return "1"
        else:
            return f"n ^ {c}"
    elif a == b ** c:
        if c == 1:
            return "n * log(n)"
        elif c == 0:
            return "log(n)"
        else:
            return  f"n ^ {c} * log(n)"
    else:
        d = math.log(a, b)
        if d == 1:
            return "n"
        elif d == 0:
            return "1"
        else:
            return f"n ^ {d}"

# unit tests
def main():
    problems = [
        (1, [0, 1], [1, 17]),               # 1
        (3, [0, -7, 0, 3], [0, 0, 0, 1/2]), # 2
        (2, [-15, -4, 29], [0, 1, 15]),     # 3
        (0, [0], [0]),                      # edge case
    ]

    for i in range(len(problems)):
        print(f"Constants {i}: ", polynomial(problems[i][0], problems[i][1], problems[i][2]))

    expressions = [
        (2, 4, 2),   # 21
        (4, 3, 1),   # 22
        (4, 4, 1),   # 23
        (4, 2, 2),   # 24
        (3, 3, 1/2), # 25
        (2, 2, 3),   # 26
        (1, 2, 0)    # edge case
    ]

    for i in range(len(expressions)):
        print(f"Master Theorem {i}: ", master(expressions[i][0], expressions[i][1], expressions[i][2]))

if __name__ == "__main__":
    main()
