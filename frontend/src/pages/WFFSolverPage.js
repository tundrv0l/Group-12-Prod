import React from 'react';
import { Page, PageContent, PageHeader, Box, Text, Card, CardBody, TextInput, CardFooter, Button, Footer, Anchor } from 'grommet';

/*
* Name: WFFSolverPage.js
* Author: Parker Clark
* Description: Solver page for the WFF to Truth Table.
*/

const WFFSolverPage = () => (
  <Page>
    <PageContent align="center" skeleton={false}>
      <PageHeader title="Well-Formed Formula To Truth Table" level="2" margin="small" />
      <Box align="center" justify="center">
        <Text size="large" margin="none" weight={500}>
          Topic: Statement And Tautologies
        </Text>
      </Box>
      <Box align="center" justify="start" direction="column" cssGap={false}>
        <Text margin={{"bottom":"small"}} textAlign="center">
          This tool helps you work with well-formed formulas (wffs) and truth tables.
        </Text>
        <Text margin={{"bottom":"small"}} textAlign="start" weight="normal">
          A WFF is a valid expression in propositional logic that is constructed using logical operators (like AND, OR, NOT, IMPLIES) and propositions (like P, Q, R). These formulas strictly adhere to the syntax rules of logic, making them suitable for mathematical reasoning.
        </Text>
        <Text margin={{"bottom":"small"}} textAlign="start" weight="normal">
          A truth table is a systematic way to list all possible truth values for a given logical expression. It shows how the truth value of the entire formula depends on the truth values of its components. Truth tables are especially useful for verifying tautologies (statements that are always true) or contradictions (statements that are always false).
        </Text>
        <Text textAlign="start" weight="normal" margin={{"bottom":"medium"}}>
          Enter your logical statement below to generate its truth table and analyze its properties!
        </Text>
      </Box>
      <Card width="large" pad="medium" background={{"color":"light-1"}}>
        <CardBody pad="small">
          <TextInput placeholder="Example: Enter your formula here (e.g., P -> Q)" />
        </CardBody>
        <CardFooter align="center" direction="row" flex={false} justify="center" gap="medium" pad={{"top":"small"}}>
          <Button label="Solve" />
        </CardFooter>
      </Card>
      <Card width="large" pad="medium" background={{"color":"light-2"}} margin={{"top":"medium"}}>
        <CardBody pad="small">
          <Text weight="bold">
            Output:
          </Text>
          <Box align="center" justify="center" pad={{"vertical":"small"}} background={{"color":"light-3"}} round="xsmall">
            <Text>
              Output will be displayed here!
            </Text>
          </Box>
        </CardBody>
      </Card>
      <Footer align="center" direction="row" flex={false} justify="center" gap="xxsmall" background={{"dark":false}} pad="medium">
        <Text>
          Found an Issue? Please report it
        </Text>
        <Anchor label="here!" gap="none" />
      </Footer>
    </PageContent>
  </Page>
);

export default WFFSolverPage;