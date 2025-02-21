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
    return await solve('properties-of-relations', { set, relation });
}

// Call closure axioms solver to the backend
export const solveClosureAxioms = async (input) => {
    return await solve('closure-axioms', { input });
}

// Call equivalence relations solver to the backend
export const solveEquivalenceRelations = async (input) => {
    return await solve('equivalence-relations', { input });
}

// Call partial orderings solver to the backend
export const solvePartialOrderings = async (input) => {
    return await solve('partial-orderings', { input });
}

// Call hasse diagram solver to the backend
export const solveHasseDiagram = async (input) => {
    return await solve('hasse-diagram', { input });
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