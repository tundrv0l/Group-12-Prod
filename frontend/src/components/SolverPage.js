import React from 'react';
import { Page, PageContent, Box, Text, Card, CardBody, CardFooter, Button, Spinner } from 'grommet';
import ReportFooter from './ReportFooter';
import Background from './Background';
import HomeButton from './HomeButton';
import PageTopScroller from './PageTopScroller';
import InfoBox from './InfoBox';

/*
* Name: SolverPage.js
* Author: Jacob Warren
* Description: Skeleton for solver pages.
*/

const SolverPage = ({ title, topic, description, paragraphs, DescriptionComponent, InfoText, InputComponent, input_props, error, handle_solve, loading, OutputComponent, render_output, output_props, ExtraComponent, topRightButton }) => {
  return (
    <PageTopScroller>
    <Page>
      <Background />
      <Box align="center" justify="center" pad="medium" background="white" style={{ position: 'relative', zIndex: 1, width: '60%', margin: 'auto', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <PageContent align="center" skeleton={false}>
          <Box align="start" style={{ position: 'absolute', top: 0, left: 0, padding: '0px'}}>
            <HomeButton />
          </Box>

          {topRightButton && (
            <Box align="end" style={{ position: 'absolute', top: 0, right: 0, padding: '10px' }}>
              <Button
                label="Toggle Funny Text"
                onClick={topRightButton}
                primary
                size="small"
                style={{ backgroundColor: 'white', color: 'white', borderRadius: '8px' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
              />
            </Box>
          )}

          <Box align="center" justify="center" pad={{ vertical: 'medium' }}>
            <Text size="xxlarge" weight="bold">
              {title}
            </Text>
          </Box>
          <Box align="center" justify="center">
            <Text size="large" margin="none" weight={500}>
              Topic: {topic}
            </Text>
          </Box>
          <Box align="center" justify="start" direction="column" cssGap={false} width='large'>
            <Text margin={{"bottom":"small"}} textAlign="center">
              {description}
            </Text>
            {/*Depending on input, render either raw text or a description component*/}
            {paragraphs ? (
                paragraphs.map((paragraph, idx) => (
                  <Text
                    key={idx}
                    margin={{ bottom: 'small' }}
                    textAlign="start"
                    weight="normal"
                  >
                    {paragraph}
                  </Text>
                ))
              ) : DescriptionComponent ? (
                <DescriptionComponent />
              ) : null}

            {/* Add the ExtraComponent here if provided */}
            {ExtraComponent && <ExtraComponent />}
          </Box>
          <Card width="large" pad="medium" background={{"color":"light-1"}}>
            <CardBody pad="small">
              <InfoBox InfoText={InfoText} />
              {typeof InputComponent === 'function' 
                ? InputComponent({...input_props}) 
                : <InputComponent {...input_props} />}
              {error && <Text color="status-critical" margin={{ top: 'small' }}>{error}</Text>}
            </CardBody>
            <CardFooter align="center" direction="row" flex={false} justify="center" gap="medium" pad={{"top":"small"}}>
              <Button label={loading ? <Spinner /> : "Solve"} onClick={handle_solve} onMouseDown={(e) => e.preventDefault()} disabled={loading} />
            </CardFooter>
          </Card>
          <Card width="large" pad="medium" background={{"color":"light-2"}} margin={{"top":"medium"}}>
            <CardBody pad="small">
              <Text weight="bold">
                Output:
              </Text>
              <Box align="center" justify="center" pad={{"vertical":"small"}} background={{"color":"light-3"}} round="xsmall">
                 {/* Render either render_output function or OutputComponent */}
                 {render_output ? (
                    render_output()
                  ) : OutputComponent ? (
                    <OutputComponent {...(output_props || {})} />
                  ) : (
                    "Output will appear here"
                  )}
              </Box>
            </CardBody>
          </Card>
          <ReportFooter />
        </PageContent>
      </Box>
    </Page>
    </PageTopScroller>
  );
};

export default SolverPage;
