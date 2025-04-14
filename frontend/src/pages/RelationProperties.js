import React from 'react';
import { Box, Text, TextInput, Button } from 'grommet';
import { solvePropertiesOfRelations, solveClosureAxioms, solveHasseDiagram, solvePartialOrderings } from '../api';
import { useDiagnostics } from '../hooks/useDiagnostics';
import SolverPage from '../components/SolverPage';
import Latex from 'react-latex-next';
//import 'katex/dist/katex.min.css';

/*
* Name: RelationProperties.js
* Author: Parker Clark, Jacob Warren
* Description: Solver page for properties of relations.
*/

const RelationProperties = () => {
  const [set, setSet] = React.useState('');
  const [relation, setRelation] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const { trackResults } = useDiagnostics("RELATION_PROPERTIES");

  // Add this function inside the RelationProperties component
  const fillWithEmpty = () => {
    const SAMPLE_SET = "{}";
    const SAMPLE_RELATION = "{}";
    setSet(SAMPLE_SET);
    setRelation(SAMPLE_RELATION);
  };

  const fillWithPartial = () => {
    const SAMPLE_SET = "{a,b,c,11}";
    const SAMPLE_RELATION = "{(a,a),(b,b),(c,c),(11,11),(a,11),(b,11),(11,c),(a,c),(b,c)}";
    setSet(SAMPLE_SET);
    setRelation(SAMPLE_RELATION);
  };

  const fillWithEquivalence = () => {
    const SAMPLE_SET = "{ls,53534,12}";
    const SAMPLE_RELATION = "{(53534,53534),(ls,ls),(12,12),(12,ls),(ls,12),(ls,53534),(53534,ls),(12,53534),(53534,12)}";
    setSet(SAMPLE_SET);
    setRelation(SAMPLE_RELATION);
  };

  const fillWithNo = () => {
    const SAMPLE_SET = "{a,b,c}";
    const SAMPLE_RELATION = "{(c,c),(a,b),(b,a),(a,c)}";
    setSet(SAMPLE_SET);
    setRelation(SAMPLE_RELATION);
  };

  const fillWithPartialSplit = () => {
    const SAMPLE_SET = "{a,b,c,d,e}";
    const SAMPLE_RELATION = "{(a,a),(b,b),(c,c),(d,d),(e,e),(a,b),(b,c),(a,c),(d,e)}";
    setSet(SAMPLE_SET);
    setRelation(SAMPLE_RELATION);
  };

  const handleSolve = async () => {
    // Empty output and error messages
    setLoading(true);
    setOutput('');
    setError('');
  
    // Validate input
    const isValidSet = validateSet(set);
    const isValidRelation = validateRelation(relation, set);
    
    if (!isValidRelation || !isValidSet) {
      setError('Invalid input. Please enter a valid relation/set.');
      setLoading(false);
      return;
    } 
    
    setError('');
    
    // Start timing for performance tracking
    const startTime = performance.now();
    
    try {
      let properties_result = await solvePropertiesOfRelations(set, relation);
      let closure_result = await solveClosureAxioms(set, relation);

      properties_result = JSON.parse(properties_result);
      closure_result = JSON.parse(closure_result);

      let result = Object.assign({}, properties_result, closure_result);
      if (properties_result["Reflexive"] && properties_result["Antisymmetric"] && properties_result["Transitive"]) {
        let special_result = await solvePartialOrderings(set, relation);
        let hasse_result = await solveHasseDiagram(set, relation);
        special_result = JSON.parse(special_result);
        hasse_result = JSON.parse(hasse_result);
        result = Object.assign({}, result, special_result, hasse_result);

        result["Partial"] = true;
      } else {
        result["Partial"] = false;
      }

      setOutput(result);

      // Check if there is an error key in the result
      const errorKey = Object.keys(result).find(key => key.toLowerCase().includes('error'));
      
      if (errorKey) {
        // Track result with error
        trackResults(
          { set, relation }, // Input data
          { error: result[errorKey] }, // Error result
          performance.now() - startTime // Execution time
        );
        setError(result[errorKey]);
      } else {
        // Track successful result
        trackResults(
          { set, relation }, // Input data
          result, // Success result
          performance.now() - startTime // Execution time
        );
        setOutput(result);
      }
    } catch (err) {
      // Track exception
      trackResults(
        { set, relation }, // Input data
        { error: err.message || 'Unknown error' }, // Error result
        performance.now() - startTime // Execution time
      );
      console.log(err);
      setError('An error occurred while analyzing the relations.');
    } finally {
      setLoading(false);
    }
  };

    const Info = () => {
        return (
          <>
            <Text>
              To input a set, use the following format:
            </Text>
            <Text>
              <strong>{'{a,b,c}'}</strong>
            </Text>
            <Text>
              To input a relation, use the following format:
            </Text>
            <Text>
              <strong>{'{(a,a),(b,b),(c,c),(a,b),(b,c),(a,c)}'}</strong>
            </Text>

            <Box margin={{ top: 'medium' }} align="center">
            <Button 
              label="Fill with Empty" 
              onClick={fillWithEmpty} 
              primary 
              size="small"
              border={{ color: 'black', size: '2px' }}
              pad={{ vertical: 'xsmall', horizontal: 'small' }}
              onMouseDown={(e) => e.preventDefault()}
            />
            <Button 
              label="Fill with Partial Ordering" 
              onClick={fillWithPartial} 
              primary 
              size="small"
              border={{ color: 'black', size: '2px' }}
              pad={{ vertical: 'xsmall', horizontal: 'small' }}
              onMouseDown={(e) => e.preventDefault()}
            />
            <Button 
              label="Fill with Equivalence Relation" 
              onClick={fillWithEquivalence} 
              primary
              size="small"
              border={{ color: 'black', size: '2px' }}
              pad={{ vertical: 'xsmall', horizontal: 'small' }}
              onMouseDown={(e) => e.preventDefault()}
            />
            <Button 
              label="Fill with No Properties" 
              onClick={fillWithNo} 
              primary
              size="small"
              border={{ color: 'black', size: '2px' }}
              pad={{ vertical: 'xsmall', horizontal: 'small' }}
              onMouseDown={(e) => e.preventDefault()}
            />
            <Button 
              label="Fill with Partial Split Diagram" 
              onClick={fillWithPartialSplit} 
              primary
              size="small"
              border={{ color: 'black', size: '2px' }}
              pad={{ vertical: 'xsmall', horizontal: 'small' }}
              onMouseDown={(e) => e.preventDefault()}
            />
          </Box>
          </>
        );
    };

  // Validate that set conforms to format
  const validateSet = (input) => {
    // Allow both non-empty sets {a, b, c, 23} and empty sets {}
    const setRegex = /^\{(\s*[a-zA-Z0-9]+\s*,)*\s*[a-zA-Z0-9]+\s*\}$|^\{\s*\}$/;
    return setRegex.test(input);
  };

  // Validate that relation conforms to format
  const validateRelation = (input, set) => {
    // Check for empty relation
    if (input.trim() === '{}') {
      return true; // Empty relation is valid
    }

    // Tests if input is in the form {(a, b), (23, c)}
    const relationRegex = /^\{(\s*\(\s*[a-zA-Z0-9]+\s*,\s*[a-zA-Z0-9]+\s*\)\s*,)*\s*\(\s*[a-zA-Z0-9]+\s*,\s*[a-zA-Z0-9]+\s*\)\s*\}$/;
    if (!relationRegex.test(input)) {
      return false;
    }
    
    // If set is empty but relation isn't, the relation can't be valid
    if (set.trim() === '{}') {
      return false;
    }
    
    // Checks if all elements in the relation are in the set
    const setElements = set.replace(/[{}]/g, '').split(/\s*,\s*/).filter(Boolean);
    const relationElements = input.replace(/[{}()]/g, '').split(/\s*,\s*/).filter(Boolean);
    
    return relationElements.every(element => setElements.includes(element));
  };

  return (
    <SolverPage
      title="Properties of Relations"
      topic="Relations"
      description="This tool helps you analyze binary relations on sets."
      DescriptionComponent={Description}
      InfoText={Info}
      InputComponent={Input}
      input_props={{set, relation, setSet, setRelation}}
      error={error}
      handle_solve={handleSolve}
      loading={loading}
      OutputComponent={Output}
      output_props={{output}}
    />
  );
};

const Description = () => {
    return (
      <div style={{textAlign: "left"}}>
        <LatexLine
          string="A binary relation on a set $S$ is a subset, $\rho$, of $S\times S$."
        />
        <Text weight="bold" margin={{"bottom": "small"}}>Properties</Text> 
        <LatexLine
          string="$\rho$ is reflexive $\iff\forall x\in S$, $(x,x)\in\rho$."
        />
        <LatexLine
          string="$\rho$ is irreflexive $\iff\forall x\in S$, $(x,x)\notin\rho$."
        />
        <LatexLine
          string="$\rho$ is symmetric $\iff\forall x,y\in S$, $(x,y)\in\rho\implies (y,x)\in\rho$."
        />
        <LatexLine
          string="$\rho$ is asymmetric $\iff\forall x,y\in S$, $(x,y)\in\rho\implies (y,x)\notin\rho$."
        />
        <LatexLine
          string="$\rho$ is antisymmetric $\iff\forall x,y\in S$, $(x,y), (y,x)\in\rho\implies x=y$."
        />
        <LatexLine
          string="$\rho$ is transitive $\iff\forall x,y,z\in S$, $(x,y),(y,z)\in\rho\implies (x,z)\in\rho$."
        />
        <Text weight="bold" margin={{"bottom": "small"}}>Closures</Text>
        <LatexLine
          string="The closure of $\rho$ with respect to some property, $P$, is the smallest superset of $\rho$ such that $P$ holds. The solver outputs the reflexive, symmetric, and transitive closures of non-reflexive, non-symmetric, or non-transitive relations."
        />
        <Text weight="bold" margin={{"bottom": "small"}}>Partial Ordering</Text>
        <LatexLine
          string="$\rho$ is a partial ordering if it is reflexive, antisymmetric, and transitive. The solver outputs a Hasse diagram and the minimal, maximal, least, and greatest elements of partial orders."
        />
        <LatexLine
          string="$x\in S$ is the least element of $S\iff\forall y\in S, (x,y)\in\rho$."
        />
        <LatexLine
          string="$x\in S$ is the greatest element of $S\iff\forall y\in S, (y,x)\in\rho$."
        />
        <LatexLine
          string="$x\in S$ is a minimal element of $S\iff\forall y\in S-\{x\}, (y,x)\notin\rho$."
        />
        <LatexLine
          string="$x\in S$ is a maximal element of $S\iff\forall y\in S-\{x\}, (x,y)\notin\rho$."
        />
        <Text weight="bold" margin={{"bottom": "small"}}>Equivalence Relation</Text>
        <LatexLine
          string="$\rho$ is an equivalence relation if it is reflexive, symmetric, and transitive."
        />
        <LatexLine
          string="Enter your $S$ and $\rho$ below."
        />
      </div>
    );
};

const LatexLine = ({string}) => {
    return (
        <div>
            <Latex strict>{string}</Latex>
        </div>
    );
}

const Input = React.memo(({set, relation, setSet, setRelation}) => {
    return (
      <>
        <Box margin={{top : "small" }}>
          <TextInput 
            placeholder="Enter S here (e.g., {a, b, c, 23})"
            value={set}
            onChange={(event) => setSet(event.target.value)}
          />
        </Box>
        <Box margin={{top : "small" }}>
          <TextInput 
            placeholder="Enter ρ here (e.g., {(a, b), (23, c)})"
            value={relation}
            onChange={(event) => setRelation(event.target.value)}
          />
        </Box>
      </>
    );
});

const Output = ({ output }) => {
    if (!output) {
      return "Output will be displayed here!";
    }

    let properties = "$\\rho$ is a ";
    let something = false;
    let reflexive_closure;
    const is_reflexive = output["Reflexive"];
    if (is_reflexive) {
        properties += "reflexive, ";
        something = true;
    } else if (output["Irreflexive"]) {
        reflexive_closure = output["Reflexive Closure"];
        properties += "irreflexive, ";
        something = true;
    } else {
        reflexive_closure = output["Reflexive Closure"];
    }

    let symmetric_closure;
    const is_symmetric = output["Symmetric"];
    if (is_symmetric) {
        properties += "symmetric, ";
        something = true;
    } else if (output["Antisymmetric"]) {
        symmetric_closure = output["Symmetric Closure"]
        something = true;
        // asymmetric implies antisymmetric
        if (output["Asymmetric"]) {
            properties += "asymmetric, ";
        } else {
            properties += "antisymmetric, ";
        }
    } else {
        symmetric_closure = output["Symmetric Closure"];
    }

    let transitive_closure;
    const is_transitive = output["Transitive"];
    if (is_transitive) {
        properties += "transitive, ";
        something = true;
    } else {
        transitive_closure = output["Transitive Closure"];
    }

    if (something) {
        properties = properties.slice(0, -2);
        properties += " "
    }

    properties += "relation on $S$."

    let least;
    let greatest;
    let minimals;
    let maximals;
    let diagram;
    const is_partial = output["Partial"];
    if (is_partial) {
        least = output["Least Element"];
        greatest = output["Greatest Element"];
        minimals = output["Minimal Elements"];
        maximals = output["Maximal Elements"];
        diagram = output["Hasse Diagram"];
    }

    return (
      <>
         <LatexLine
          string={properties}
        />
          {!is_reflexive && (
            <div>
              Reflexive Closure: {reflexive_closure}
            </div>
          )}
          {!is_symmetric && (
            <div>
              Symmetric Closure: {symmetric_closure}
            </div>
          )}
          {!is_transitive && (
            <div>
              Transitive Closure: {transitive_closure}
            </div>
          )}
          {is_partial && (
              <>
                  <div>
                    Least Element: {least}
                  </div>
                  <div>
                    Greatest Element: {greatest}
                  </div>
                  <div>
                    Minimal Elements: {minimals}
                  </div>
                  <div>
                    Maximal Elements: {maximals}
                  </div>
                  <Box>
                    <img src={`data:image/png;base64,${diagram}`} alt="Hasse Diagram" />
                  </Box>
              </>
          )}
      </>
    );
};

export default RelationProperties;
