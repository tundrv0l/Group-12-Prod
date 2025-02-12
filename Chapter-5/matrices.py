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
    problems = [
        [
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
        ]
    ]

    print(matrix_and(problems[0][0], problems[0][1]))
    print(matrix_or(problems[0][0], problems[0][1]))
    print(matrix_multiply(problems[0][0], problems[0][1]))

if __name__ == "__main__":
    main()