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

export const solveBasicSetFunctions = async (input) => {
    return await solve('basic-set-functions', { input });
}