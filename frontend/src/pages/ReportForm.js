import React from 'react';
import { Page, PageContent, PageHeader, Box, Text, TextInput, Button, TextArea} from 'grommet';

/*
* Name: ReportForm.js
* Author: Parker Clark
* Description: Form to report issues to the webmaster
*/

const ReportForm = () => (
    <Page>
        <PageContent align="center" skeleton={false} justify="center">
        <Box align="center" justify="center">
            <PageHeader title="Problem Report Contact Page" level="2" margin="small" />
        </Box>
        <Box align="center" justify="center">
            <Text size="large" margin="none" weight={500}>
            Found a problem? Tell us about it!
            </Text>
        </Box>
        <Box align="center" justify="center" margin={{"vertical":"xsmall"}}>
            <TextArea defaultValue="Tell us what went wrong" size="medium" disabled={false} />
        </Box>
        <Box align="center" justify="center">
            <TextInput placeholder="Your email" />
            <Box align="center" justify="center" margin={{"vertical":"small"}}>
            <Button label="Send" />
            </Box>
        </Box>
        </PageContent>
    </Page>
);

export default ReportForm;