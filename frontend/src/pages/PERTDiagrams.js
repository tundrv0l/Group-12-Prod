import React from 'react';
import { Box } from 'grommet';
import { solveCriticalPaths, solvePERTDiagrams, solveTopologicalSorting } from '../api';
import TaskTableInput from '../components/TaskTableInput';
import SolverPage from '../components/SolverPage';
import { useDiagnostics } from '../hooks/useDiagnostics';

/*
* Name: PERTDiagrams.js
* Author: Parker Clark, Jacob Warren
* Description: 5.2 task table analysis
*/

const PERTDiagrams = () => {
  const [tasks, setTasks] = React.useState([{ name: '', prerequisites: new Set(), time: 0 }]);
  const [isTimed, setIsTimed] = React.useState(true);
  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  
  // Add diagnostics
  const { trackResults } = useDiagnostics("PERT_DIAGRAMS");

  const SAMPLE_TASKS = [
    { name: 'A', prerequisites: new Set(), time: 3 },
    { name: 'B', prerequisites: new Set(['A']), time: 4 },
    { name: 'C', prerequisites: new Set(['A']), time: 2 },
    { name: 'D', prerequisites: new Set(['B', 'C']), time: 5 },
    { name: 'E', prerequisites: new Set(['D']), time: 1 }
  ];
  
  const fillWithSample = () => {
    setTasks(SAMPLE_TASKS);
  };

  const formatTasksForBackend = () => {
    // Create an object to hold the formatted data
    const taskTable = {};
    
    // Process each task
    tasks.forEach(task => {
      if (task.name) {
        // Convert the Set to an array before serializing
        const prerequisitesArray = Array.from(task.prerequisites);
        
        // For debugging
        console.log(`Task ${task.name} depends on:`, prerequisitesArray);
        
        // Store the prerequisites as an array and the time as a number
        taskTable[task.name] = [prerequisitesArray, isTimed ? task.time : 0];
      }
    });
    
    console.log("Formatted table:", taskTable);
    return taskTable;
  };

  const validateInput = () => {

    // Check for empty task names
    if (tasks.some(task => !task.name.trim())) {
      setError('All tasks must have names.');
      return false;
    }
    
    // Check for duplicate task names
    const taskNames = tasks.map(t => t.name);
    if (new Set(taskNames).size !== taskNames.length) {
      setError('Task names must be unique.');
      return false;
    }
    
    // Check for non-positive times
    if (isTimed && tasks.some(task => task.time < 0)) {
      setError('Task times cannot be negative.');
      return false;
    }
    
    // Check for circular dependencies
    const taskGraph = {};
    tasks.forEach(task => {
      taskGraph[task.name] = [...task.prerequisites];
    });
    
    // Maintain a set of visited nodes and a temporary set for cycle detection
    const visited = new Set();
    const temp = new Set();
    
    // Modified DFS to detect cycles on the fly
    function hasCycle(node) {
      if (!visited.has(node)) {

        // Mark the current node as visited and add to temporary set
        temp.add(node);
        visited.add(node);
        
        // Check all neighbors for cycles
        for (const neighbor of taskGraph[node]) {
          if (!visited.has(neighbor) && hasCycle(neighbor)) {
            return true;
          } else if (temp.has(neighbor)) {
            return true;
          }
        }
      }
      temp.delete(node);
      return false;
    }
    
    // Check for cycles in each task
    for (const taskName of taskNames) {
      if (hasCycle(taskName)) {
        setError('Circular dependencies detected. Tasks cannot depend on each other cyclically.');
        return false;
      }
    }
    
    return true;
  };

  const handleSolve = async () => {
    setLoading(true);
    setOutput('');
    setError('');

    // Validate input
    if (!validateInput()) {
      setLoading(false);
      return;
    }

    // Format input to backend specification 
    const tableFormat = formatTasksForBackend();
    
    const startTime = performance.now();
    try {
      // combine them
      let critical_result;
      if (isTimed) { critical_result = await solveCriticalPaths(tableFormat); }
      let pert_result = await solvePERTDiagrams(tableFormat);
      let topological_result = await solveTopologicalSorting(tableFormat);

      if (isTimed) { critical_result = JSON.parse(critical_result); }
      pert_result = JSON.parse(pert_result);
      topological_result = JSON.parse(topological_result);

      let result = Object.assign({}, pert_result, topological_result);
      if (isTimed) { result = Object.assign({}, result, critical_result) }

      setOutput(result);
      
      // Tracking results for diagnostics
      trackResults(
        { tasks: tableFormat, isTimed },
        result, 
        performance.now() - startTime
      );
    } catch (err) {
      trackResults(
        { tasks: tableFormat, isTimed },
        { error: err.message || "Error solving table" },
        performance.now() - startTime
      );
      setError('An error occurred while solving the table.');
    } finally {
      setLoading(false);
    }
  };
  
  const renderOutput = () => {
    if (!output) {
      return "Output will be displayed here!";
    }

    let critical_path;
    if (isTimed) { critical_path = output["Critical Path"]; }
    const minimum_time = output["Minimum Time"];
    const diagram = output["PERT Diagram"];
    const total_relation = output["Relation"];

    return (
      <>
          {isTimed && (
              <>
                  <div>
                    Critcal Path: {critical_path}
                  </div>
                  <div>
                    Minimum Time: {minimum_time}
                  </div>
              </>
          )}
          <div>
            Total Relation: {total_relation}
          </div>
          <Box>
            {/* Convert base64 image string to image element */}
            <img src={`data:image/png;base64,${diagram}`} alt="PERT Diagram" />
          </Box>
      </>
    );
  };

  return (
    <SolverPage
      title="PERT Diagrams"
      topic="Topological Sorting"
      description="This tool helps you analyze PERT Diagrams in discrete mathematics."
      paragraphs={[
        "A PERT (Program Evaluation Review Technique) diagram is a graphical representation used to model the tasks and dependencies in a project. This tool allows you to input a set of tasks and their dependencies to generate a PERT diagram.",
        "By analyzing PERT diagrams, you can visualize the sequence of tasks, identify critical paths, and optimize task scheduling. This tool allows you to input a set of tasks and their dependencies to generate the PERT diagram and analyze the critical paths.",
        "Enter your tasks and dependencies below to generate and analyze the PERT diagram and critical paths!"
      ]}
      InputComponent={TaskTableInput}
      input_props={{tasks, setTasks, isTimed, setIsTimed, fillWithSample}}
      error={error}
      handle_solve={handleSolve}
      loading={loading}
      render_output={renderOutput}
    />
  );
};

export default PERTDiagrams;
