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
export const solveRecursion = async (input) => {
    return await solve('recursive-definitions', { input });
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
export const solvePropertiesOfRelations = async (input) => {
    return await solve('properties-of-relations', { input });
}

// Call closure axioms solver to the backend
export const solveClosureAxioms = async (input) => {
    return await solve('closure-axioms', { input });
}

// Call equivalence relations solver to the backend
export const solveEquivalenceRelations = async (input) => {
    return await solve('equivalence-relations', { input });
}