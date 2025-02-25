import axios from 'axios';

/*
* Name: api.js
* Author: Parker Clark
* Description: Axios API calls for the frontend.
*/ 

// A function to route and pass solver code to the backend
const solve = async (solverType, data) => {
    try {
        const response = await axios.post(`http://localhost:5000/solve/${solverType}`, data);
        return response.data;
    } catch (error)
    {
        console.error('Error Solving:', error);
        return null;
    }
};

// A function to report problems to the webmaster
const report = async (email, issue) => {
    try {
        const response = await axios.post('http://localhost:5000/report-problem', { email, issue });
        return response;
    } catch (error)
    {
        console.error('Error Reporting:', error);
        throw error
    }
}

// Driver function to call the report function to the backend
export const reportProblem = async (email, issue) => {
    return await report(email, issue);
};

// Call WFF to Truthtable solver to the backend 
export const solveWFF = async (formula) => {
    return await solve('wff', { formula });
};

// Call Propositional Logic solver to the backend
export const solvePropositionalLogic = async (hypotheses, conclusion) => {
    return await solve('propositional-logic', { hypotheses, conclusion });
};

// Call recursion solver to the backend
export const solveRecursion = async (formula, baseCase, n) => {
    return await solve('recursive-definitions', { formula, baseCase, n });
};

// Call basic set functions solver to the backend
export const solveBasicSetFunctions = async (input) => {
    return await solve('basic-set-functions', { input });
}

// Call power set solver to the backend
export const solvePowerSet = async (input) => {
    return await solve('power-set', { input });
}

// Call set complement solver to the backend
export const solveSetComplement = async (input) => {
    return await solve('set-complement', { input });
}

// Call binary and unary operators solver to the backend
export const solveBinaryUnaryOperators = async (input) => {
    return await solve('binary-unary-operators', { input });
}

// Call cartesian products solver to the backend
export const solveCartesianProducts = async (input) => {
    return await solve('cartesian-products', { input });
}

// Call properties of relations solver to the backend
export const solvePropertiesOfRelations = async (set, relation) => {
     try {
        const response = await solve('properties-of-relations', { set, relation });
        if (response.error) {
            throw new Error(response.error);
        }
        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Call closure axioms solver to the backend
export const solveClosureAxioms = async (set, relation) => {
    try {
        const response = await solve('closure-axioms', { set, relation });
        if (response.error) {
            throw new Error(response.error);
        }
        return response;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Call equivalence relations solver to the backend
export const solveEquivalenceRelations = async (set, relation) => {
    try {
        const response = await solve('equivalence-relations', { set, relation });
        if (response.error) {
            throw new Error(response.error);
        }
        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Call partial orderings solver to the backend
export const solvePartialOrderings = async (set, relation) => {
    try {
        const response = await solve('partial-orderings', { set, relation });
        if (response.error) {
            throw new Error(response.error);
        }
        return response;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Call hasse diagram solver to the backend
export const solveHasseDiagram = async (set, relation) => {
    try {
        const response = await solve('hasse-diagrams', { set, relation });
        if (response.error) {
            throw new Error(response.error);
        }
        return response;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Call critical paths solver to the backend
export const solveCriticalPaths = async (input) => {
    return await solve('critical-paths', { input });
}

// Call PERT Diagrams solver to the backend
export const solvePERTDiagrams = async (input) => {
    return await solve('pert-diagrams', { input });
}

// Call topological sorting solver to the backend
export const solveTopologicalSorting = async (input) => {
    return await solve('topological-sorting', { input });
}

// Call permutations of a cycle solver to the backend
export const solvePermutationsCycle = async (input) => {
    return await solve('permutations-cycle', { input });
}

// Call compositions of permutations solver to the backend
export const solveCompositions = async (input) => {
    return await solve('compositions', { input });
}

// Call disjoint cycles solver to the backend
export const solveDisjointCycles = async (input) => {
    return await solve('disjoint-cycles', { input });
}

// Call order of magnitude solver to the backend
export const solveOrderOfMagnitude = async (input) => {
    return await solve('order-of-magnitude', { input });
}

// Call the master theorem solver to the backend
export const solveMasterTheorem = async (input) => {
    return await solve('master-theorem', { input });
}

// Solve boolean matrices to the backend
export const solveBooleanMatrices = async (matrix1, matrix2, operation) => {
    return await solve('boolean-matrices', { matrix1, matrix2, operation });
}

// Solve boolean matrices to the backend
export const solveBooleanMatricesOperations = async (matrix1, matrix2) => {
    return await solve('matrice-operations', { matrix1, matrix2 });
}

// Solve Graphs to the backend
export const solveGraphs = async (input) => {
    return await solve('graphs', { input });
}

// Solve Adjacency Matrices and Adjacency Lists to the backend
export const solveAdjacencyMatricesLists = async (input) => {
    return await solve('adjacency-matrices-lists', { input });
}

// Solve Weighted Graphs to the backend
export const solveWeightedGraphs = async (input) => {
    return await solve('weighted-graphs', { input });
}

// Solve Binary Trees to the backend
export const solveBinaryTrees = async (input) => {
    return await solve('binary-trees', { input });
}

// Solve Array to Tree to the backend
export const solveArrayToTree = async (input) => {
    return await solve('array-to-tree', { input });
}

// Solve Tree to Array to the backend
export const solveTreeToArray = async (input) => {
    return await solve('tree-to-array', { input });
}

// Solve tree notation to the backend
export const solveTreeNotation = async (input) => {
    return await solve('tree-notation', { input });
}

// Solve warshall's algorithm to the backend
export const solveWarshallsAlgorithm = async (input) => {
    return await solve('warshalls-algorithm', { input });
}