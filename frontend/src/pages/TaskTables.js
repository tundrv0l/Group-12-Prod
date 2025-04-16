import React from 'react';
import { Box, Text, Button } from 'grommet';
import { solveCriticalPaths, solvePERTDiagrams, solveTopologicalSorting } from '../api';
import { useDiagnostics } from '../hooks/useDiagnostics';
import TaskTableInput from '../components/TaskTableInput';
import SolverPage from '../components/SolverPage';
import LatexLine from '../components/LatexLine';

/*
* Name: TaskTables.js
* Author: Parker Clark, Jacob Warren
* Description: 5.2 task table analysis
*/

const TaskTables = () => {
  const [tasks, setTasks] = React.useState([{ name: '', prerequisites: new Set(), time: 0 }]);
  const [isTimed, setIsTimed] = React.useState(true);
  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  
  // Add diagnostics
  const { trackResults } = useDiagnostics("PERT_DIAGRAMS");
  
  const fillWithSingle = () => {
      const SAMPLE_TASKS = [
        { name: 'A', prerequisites: new Set(), time: 3 },
        { name: 'B', prerequisites: new Set(['A']), time: 4 },
        { name: 'C', prerequisites: new Set(['A']), time: 2 },
        { name: 'D', prerequisites: new Set(['B', 'C']), time: 5 },
        { name: 'E', prerequisites: new Set(['D']), time: 1 }
      ];

    setTasks(SAMPLE_TASKS);
  };

  const fillWithPronged = () => {
      const SAMPLE_TASKS = [
        { name: 'A', prerequisites: new Set(), time: 3 },
        { name: 'B', prerequisites: new Set(), time: 44 },
        { name: 'C', prerequisites: new Set(['D']), time: 2 },
        { name: 'D', prerequisites: new Set(['A', 'B']), time: 5 },
        { name: 'E', prerequisites: new Set(['D']), time: 12 }
      ];

    setTasks(SAMPLE_TASKS);
  };

  const fillWithSplit = () => {
      const SAMPLE_TASKS = [
        { name: 'A', prerequisites: new Set(), time: 3 },
        { name: 'B', prerequisites: new Set(['A']), time: 14 },
        { name: 'C', prerequisites: new Set(), time: 20 },
        { name: 'D', prerequisites: new Set(['A']), time: 5 },
        { name: 'E', prerequisites: new Set(['C']), time: 12 }
      ];

    setTasks(SAMPLE_TASKS);
  };

  const fillWithSingleton = () => {
      const SAMPLE_TASKS = [
        { name: 'A', prerequisites: new Set(), time: 3 },
      ];

    setTasks(SAMPLE_TASKS);
  };

  const fillWithMultipleCrit = () => {
      const SAMPLE_TASKS = [
        { name: 'A', prerequisites: new Set(), time: 3 },
        { name: 'B', prerequisites: new Set(['A']), time: 14 },
        { name: 'C', prerequisites: new Set(), time: 12 },
        { name: 'D', prerequisites: new Set(['C']), time: 5 },
      ];

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
    if (isTimed && tasks.some(task => task.time <= 0)) {
      setError('Task times must be positive.');
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
      if (isTimed) { result = Object.assign({}, result, critical_result); }

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

    const Info = () => {
      return (
        <>
          <Text weight="bold" margin={{ bottom: "xsmall" }}>
            Task Table Input:
          </Text>
          <Text>
            A task table represents activities with their dependencies and durations.
          </Text>
          <Text margin={{ top: "xsmall" }}>
            To use this tool:
          </Text>
          <Text>1. Add tasks with descriptive names (A, B, C, etc.)</Text>
          <Text>2. For each task, select its prerequisites (tasks that must be completed before it can start)</Text>
          <Text>3. Enter the time required to complete each task</Text>
          <Text>4. Click Solve to generate the diagram and analyze paths</Text>
          
          <Box margin={{ top: 'medium' }} align="center">
            <Button 
              label="Fill with Single Endpoint" 
              onClick={fillWithSingle} 
              primary 
              size="small"
              border={{ color: 'black', size: '2px' }}
              pad={{ vertical: 'xsmall', horizontal: 'small' }}
            />
            <Button 
              label="Fill with Multiple Endpoints" 
              onClick={fillWithPronged} 
              primary 
              size="small"
              border={{ color: 'black', size: '2px' }}
              pad={{ vertical: 'xsmall', horizontal: 'small' }}
            />
            <Button 
              label="Fill with Independent Paths" 
              onClick={fillWithSplit} 
              primary 
              size="small"
              border={{ color: 'black', size: '2px' }}
              pad={{ vertical: 'xsmall', horizontal: 'small' }}
            />
            <Button 
              label="Fill with Single Task" 
              onClick={fillWithSingleton} 
              primary 
              size="small"
              border={{ color: 'black', size: '2px' }}
              pad={{ vertical: 'xsmall', horizontal: 'small' }}
            />
            <Button 
              label="Fill with Multiple Critical Paths" 
              onClick={fillWithMultipleCrit} 
              primary 
              size="small"
              border={{ color: 'black', size: '2px' }}
              pad={{ vertical: 'xsmall', horizontal: 'small' }}
            />
          </Box>
        </>
      ); 
    }

  return (
    <SolverPage
      title="Task Scheduling"
      topic="Topological Sorting"
      description="This tool helps you analyze task scheduling."
      DescriptionComponent={Description}
      InfoText={() => <Info/>}
      InputComponent={TaskTableInput}
      input_props={{tasks, setTasks, isTimed, setIsTimed}}
      error={error}
      handle_solve={handleSolve}
      loading={loading}
      OutputComponent={Output}
      output_props={{output, isTimed}}
    />
  );
};

const Description = () => {
    return (
      <div style={{textAlign: "left"}}>
        <LatexLine
          string="Given a table of tasks, their prerequisites, and, optionally, their time to perform, a partial ordering on tasks can be defined by $A\preceq B\iff A=B$ or $A$ is a prerequisite for $B$."
        />
        <Text weight="bold" margin={{"bottom": "small"}}>Total Ordering</Text>
        <LatexLine
          string="A total ordering is a partial ordering such that for any $x$ and $y$, $x\preceq y$ or $x\preceq y$ is true. For any partial order, $\preceq$, there exists a total order that extends it; such an extension can be produced through topological sorting (for finite sets)."
        />
        <Text weight="bold" margin={{"bottom": "small"}}>Topological Sort</Text>
        <LatexLine
          string="To produce a total order from a partial order, we remove minimal elements from the set until it is empty. Then the total ordering is produced by ordering the elements by first removed: $x_1\prec x_2\prec\ldots\prec x_n$. The solver will produce a total ordering extending the partial ordering implied by the table inputted."
        />
        <Text weight="bold" margin={{"bottom": "small"}}>Critical Path</Text>
        <LatexLine
          string="A critical path is a sequence of tasks, starting with a task with no prerequisites and ending with a task with no dependent tasks, such that the time to complete said path is equal to the minimum amount of time required to finish all of the tasks. This solver computes one (of possibly multiple, equal in duration) critical paths and outputs the sequence and its time. Critical paths only apply to timed tasks, so untimed tables will only output the PERT diagram and total ordering."
        />
        <Text weight="bold" margin={{"bottom": "small"}}>PERT Chart</Text>
        <LatexLine
          string="A PERT chart is similar to a Hasse diagram in that it represents a partial order, but it progresses from left to right, is directed, and has times for timed tasks."
        />
        <LatexLine
          string="Enter your timed or untimed tasks below."
        />
      </div>
    ); 
}

const Output = ({ output, isTimed }) => {
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
            <img src={`data:image/png;base64,${diagram}`} alt="PERT Chart" />
          </Box>
      </>
    );
};

export default TaskTables;
