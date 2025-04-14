import axios from 'axios';

/*
* Name: api.js
* Author: Parker Clark
* Description: Axios API calls for the frontend.
*/ 

// Get the API URL from environment variable or fallback to localhost for development
const API_BASE_URL = (window._env_ && window._env_.API_URL) || 'http://localhost:5000';
const API_KEY = (window._env_ && window._env_.API_KEY) || 'development-key';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'X-API-Key': API_KEY
    }
});

// A function to route and pass solver code to the backend
// Core solve function that needs fixing
const solve = async (solverType, data) => {
    try {
        const response = await apiClient.post(`/solve/${solverType}`, data);
        return response.data;
    } catch (error) {
        console.error('Error Solving:', error);
        
        // Return structured error info instead of null
        return { 
            error: error.response?.data?.['Calculation Error'] || 
                  error.response?.data?.error || 
                  error.message || 
                  'An unknown error occurred'
        };
    }
};

// A function to report problems to the webmaster
const report = async (email, issue) => {
    try {
        const response = await apiClient.post(`/report-problem`, { email, issue });
        return response;
    } catch (error)
    {
        console.error('Error Reporting:', error);
        throw error
    }
}

// Send diagnostic struct to the backend
export const sendDiagnostics = async (payload) => {
    try {
        const response = await apiClient.post('/diagnostics', payload);
        return response;
    } catch (error)
    {
        // Return null if there is an error
        return null
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
    return await solve('basic-set-functions',  input );
}

// Call power set solver to the backend
export const solvePowerSet = async (input) => {
    return await solve('power-set', input );
}

// Call set complement solver to the backend
export const solveSetComplement = async (input) => {
    return await solve('set-complement', input );
}

// Call binary and unary operators solver to the backend
export const solveBinaryUnaryOperators = async (choice, set, table, expression) => {
    return await solve('binary-unary-operators', { 
        choice, 
        set, 
        table, 
        expression 
    });
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
export const solvePartitions = async (set, relation) => {
    const response = await solve('partitions', { set, relation });
    return response;
}

// Call adjacency matrices and lists solver to the backend
export const solveAdjacencyMatricesLists = async (input, type) => {
    try {
        const response =  await solve('adjacency-matrices-lists', { input, type });
        if (response.error) {
            throw new Error(response.error);
        }
        return response;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Call array to tree solver to the backend
export const solveArrayToTree = async (input) => {
    return await solve('array-to-tree', { input });
}

// Call binary trees solver to the backend
export const solveBinaryTrees = async (input, choice) => {
    return await solve('binary-trees', { input, choice });
}

// Call boolean matrices solver to the backend
export const solveBooleanMatrices = async (matrix1, matrix2, operation) => {
    return await solve('boolean-matrices', { matrix1, matrix2, operation });
}

// Call compositions of permutations solver to the backend
export const solveCompositions = async (setOne, setTwo) => {
    return await solve('compositions', { setOne, setTwo });
}

// Call critical paths solver to the backend
export const solveCriticalPaths = async (taskTable) => {
    try {
        const response = await solve('critical-paths', taskTable);
        return response
    } catch (error) {
        console.error('Error finding critical paths:', error);
        throw error;
    }
}


// Call disjoint cycles solver to the backend
export const solveDisjointCycles = async (input) => {
    return await solve('disjoint-cycles', { input });
}

// Call graphs solver to the backend
export const solveGraphs = async (pairs, type, isIsomorphic, secondInput) => {
    return await solve('graphs', { pairs, type, isIsomorphic, secondInput });
}

// Call Hasse diagram solver to the backend
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

// Call order of magnitude solver to the backend
export const solveOrderOfMagnitude = async (payload) => {
    try {
        const response = await solve('order-of-magnitude', payload);
        return response
    } catch (error) {
        console.error('Error solving Order of Magnitude:', error);
        throw error;
    }
}

// Call PERT diagrams solver to the backend
export const solvePERTDiagrams = async (taskTable) => {
    try {
        const response = await solve('pert-diagrams', taskTable);
        return response
    } catch (error) {
        console.error('Error solving PERT diagram:', error);
        throw error;
    }
}

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

// Call permutations of a cycle solver to the backend
export const solvePermutationsCycle = async (input) => {
    return await solve('permutations-cycle', { input });
}

// Call topological sorting solver to the backend
export const solveTopologicalSorting = async (taskTable) => {
    try {
        // Here we don't need to wrap it in {input: ...} as the controller expects the raw data
        const response = await solve('topological-sorting', taskTable);
        return response;
    } catch (error) {
        console.error('Error topologically sorting:', error);
        throw error;
    }
}

// Call tree to array solver to the backend
export const solveTreeToArray = async (input, choice) => {
    return await solve('tree-to-array', { input, choice });
}

// Call Warshall's algorithm solver to the backend
export const solveWarshallsAlgorithm = async (input) => {
    return await solve('warshalls-algorithm', { input });
}

// Call weighted graphs solver to the backend
export const solveWeightedGraphs = async (input, type) => {
    try {
        const response = await solve('weighted-graphs', { input, type });
        if (response.error) {
            throw new Error(response.error);
        }
        return response;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Solve tree notation to the backend
export const solveTreeNotation = async (input, secondaryInput, operation) => {
    return await solve('tree-notation', { input, secondaryInput, operation });
}

// Solve master theorem to the backend
export const solveMasterTheorem = async (input) => {
    return await solve('master-theorem',  input );
}
