import React from 'react';
import { Box, Text, TextInput, Button } from 'grommet';
import { solvePropertiesOfRelations, solveClosureAxioms, solveHasseDiagram, solvePartialOrderings } from '../api';
import { useDiagnostics } from '../hooks/useDiagnostics';
import SolverPage from '../components/SolverPage';

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
  const [isPartial, setIsPartial] = React.useState(false);

  const { trackResults } = useDiagnostics("RELATION_PROPERTIES");

  const SAMPLE_SET = "{a, b, c}";
  const SAMPLE_RELATION = "{(a,a),(b,b),(c,c),(a,b),(b,c),(a,c)}";

  // Add this function inside the RelationProperties component
  const fillWithSample = () => {
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

       // Establish partial ordering in a const
      const isPartial = properties_result["Reflexive"] && 
                             properties_result["Antisymmetric"] && 
                             properties_result["Transitive"];
      
      // Set the state
      setIsPartial(isPartial);

      let result = Object.assign({}, properties_result, closure_result);
      if (isPartial) {
        let special_result = await solvePartialOrderings(set, relation);
        let hasse_result = await solveHasseDiagram(set, relation);
        special_result = JSON.parse(special_result);
        hasse_result = JSON.parse(hasse_result);
        result = Object.assign({}, result, special_result, hasse_result);

        result.isPartial = true;
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

  // Validate that set conforms to format
  const validateSet = (input) => {
    // Allow both non-empty sets {a, b, c, 23} and empty sets {}
    const setRegex = /^\{(\s*[a-zA-Z0-9]+\s*,)*\s*[a-zA-Z0-9]+\s*\}$|^\{\s*\}$/;
    return setRegex.test(input);
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
          label="Fill with Sample" 
          onClick={fillWithSample} 
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
      description="This tool helps you analyze the properties of relations."
      DescriptionComponent={Description}
      InfoText={Info}
      InputComponent={Input}
      input_props={{set, relation, setSet, setRelation}}
      error={error}
      handle_solve={handleSolve}
      loading={loading}
      OutputComponent={Output}
      output_props={{output, isPartial}}
    />
  );
};

const Description = () => {
    return (
      <>
        <Text margin={{"bottom":"small"}} textAlign="start" weight="normal">
            A relation on a set is a collection of ordered pairs of elements from the set. Relations can have various properties such as reflexivity, symmetry, transitivity, and antisymmetry. For example, a relation R on a set A is:
        </Text>
        <Box margin={{"bottom":"small"}} textAlign="start" weight="normal">
            <Text>- Reflexive if every element is related to itself, i.e., (a, a) ∈ R for all a ∈ A.</Text>
            <Text>- Irreflexive if no element is related to itself, i.e., (a, a) ∉ R for all a ∈ A.</Text>
            <Text>- Symmetric if for every (a, b) ∈ R, (b, a) ∈ R.</Text>
            <Text>- Asymmetric if for every (a, b) ∈ R, (b, a) ∉ R.</Text>
            <Text>- Antisymmetric if for every (a, b) ∈ R and (b, a) ∈ R, a = b.</Text>
            <Text>- Transitive if for every (a, b) ∈ R and (b, c) ∈ R, (a, c) ∈ R.</Text>
        </Box>
        <Text textAlign="start" weight="normal" margin={{"bottom":"medium"}}>
          Enter your relation below to analyze its properties and determine if it is reflexive, irreflexive, symmetric, asymmetric, antisymmetric, or transitive!
        </Text>
      </>
    );
};

const Input = React.memo(({set, relation, setSet, setRelation}) => {
    return (
      <>
        <Box margin={{top : "small" }}>
          <TextInput 
            placeholder="Example: Enter your set here (e.g., {a, b, c, 23})"
            value={set}
            onChange={(event) => setSet(event.target.value)}
          />
        </Box>
        <Box margin={{top : "small" }}>
          <TextInput 
            placeholder="Example: Enter your relation here (e.g., {(a, b), (23, c)})"
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

    let properties = "This is a ";
    let something = false;
    let reflexive_closure;
    if (output["Reflexive"]) {
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
    if (output["Symmetric"]) {
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
    if (output["Transitive"]) {
        properties += "transitive, ";
        something = true;
    } else {
        transitive_closure = output["Transitive Closure"];
    }

    if (something) {
        properties = properties.slice(0, -2);
        properties += " "
    }

    properties += "relation."

    // Control this render via isPartial
    const isPartial = output.isPartial;

    let least;
    let greatest;
    let minimals;
    let maximals;
    let diagram;
    if (isPartial) {
        least = output["Least Element"];
        greatest = output["Greatest Element"];
        minimals = output["Minimal Elements"];
        maximals = output["Maximal Elements"];
        diagram = output["Hasse Diagram"];
    }

    return (
      <>
          <div>
            {properties}
          </div>
          {!output["Reflexive"] && (
            <div>
              Reflexive Closure: {reflexive_closure}
            </div>
          )}
          {!output["Symmetric"] && (
            <div>
              Symmetric Closure: {symmetric_closure}
            </div>
          )}
          {!output["Transitive"] && (
            <div>
              Transitive Closure: {transitive_closure}
            </div>
          )}
          {isPartial && (
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
