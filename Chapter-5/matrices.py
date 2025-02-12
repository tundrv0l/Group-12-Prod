# File: matrices.py
# Author: Jacob Warren
# Description: 5.7 stuff

# Function: matrix_and
# Input: two boolean matrices of equal dimensions
#        in the form of 2d arrays
# Output: a boolean matrix of the same dimensions
#         whose entries are the respective entries
#         from the inputted matrices ANDed together
# Purpose: solve problems like 47-50
def matrix_and(A, B):
    C = [[0 for j in range(0, len(A[0]))] for i in range(0, len(A))]

    for i in range(0, len(A)):
        for j in range(0, len(A[0])):
            C[i][j] += min(A[i][j], B[i][j])

    return C

# Function: matrix_or
# Input: two boolean matrices of equal dimensions
#        in the form of 2d arrays
# Output: a boolean matrix of the same dimensions
#         whose entries are the respective entries
#         from the inputted matrices ORed together
# Purpose: solve problems like 47-50
def matrix_or(A, B):
    C = [[0 for j in range(0, len(A[0]))] for i in range(0, len(A))]

    for i in range(0, len(A)):
        for j in range(0, len(A[0])):
            C[i][j] += max(A[i][j], B[i][j])

    return C

# Function: matrix_multply
# Input: two boolean matrices where the columns of
#        the first is equal to the rows of the second
# Output: a boolean matrix equal to the boolean matrix 
#         multiplication of the inputted ones
# Purpose: solve problems like 47-50
def matrix_multiply(A, B):
    C = [[0 for j in range(0, len(B[0]))] for i in range(0, len(A))]

    for i in range(0, len(A)):
        for j in range(0, len(B[0])):
            for k in range(0, len(A[0])):
                C[i][j] = max(C[i][j], min(A[i][k], B[k][j]))

    return C

# unit tests
def main():
    matrices = [
        ( # 47
            [
                [1, 0, 0],
                [1, 1, 0],
                [0, 1, 1]
            ],
            [
                [1, 0, 1],
                [0, 1, 1],
                [1, 1, 1]
            ]
        ),
        ( # 48
            [
                [0, 0, 1],
                [1, 1, 0],
                [1, 0, 0]
            ],
            [
                [0, 1, 1],
                [0, 0, 0],
                [1, 0, 0]
            ]
        ),
        ( # 49
            [
                [0, 1, 0],
                [1, 0, 1],
                [0, 0, 1]
            ],
            [
                [0, 1, 1],
                [0, 0, 1],
                [1, 0, 0]
            ]
        ),
        ( # 50
            [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 1]
            ],
            [
                [1, 0, 1],
                [0, 1, 1],
                [1, 1, 1]
            ]
        ),
        ( # edge case
            [[]],
            [[]]
        )
    ]

    for i in range(len(matrices)):
        print(f"A∧B {i}: ", matrix_and(matrices[i][0], matrices[i][1]))
        print(f"A∨B {i}: ", matrix_or(matrices[i][0], matrices[i][1]))
        print(f"A×B {i}: ", matrix_multiply(matrices[i][0], matrices[i][1]))
        print(f"B×A {i}: ", matrix_multiply(matrices[i][1], matrices[i][0]))

if __name__ == "__main__":
    main()
