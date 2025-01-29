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

// Call WFF to Truthtable solver to the backend 
export const solveWFF = async (formula) => {
    return await solve('wff', { formula });
};