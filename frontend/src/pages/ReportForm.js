import React, { useState } from 'react';
import { Page, PageContent, PageHeader, Box, Text, TextInput, Button, TextArea } from 'grommet';
import { reportProblem } from '../api';

/*
* Name: ReportForm.js
* Author: Parker Clark
* Description: Form to report issues to the webmaster
*/

const ReportForm = () => {
    const [email, setEmail] = useState('');
    const [issue, setIssue] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async () => {
        if (!email || !issue) {
            setError('Please fill in both fields.');
            return;
        }

        setError('');
        setSuccess('');

        try {
            const response = await reportProblem(email, issue);
            
            console.log('Response status:', response.status);

            if (response.status === 200) {
                setSuccess('Your issue has been reported successfully.');
                setEmail('');
                setIssue('');
            } else if (response.status === 500) {
                setError('Unable to send report. Please try again later.');
            } else {
                setError('Unexpected error occured. Please try again.');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
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
                <Box align="center" justify="center" margin={{ vertical: 'xsmall' }} width="large">
                    <TextArea
                        placeholder="Tell us what went wrong"
                        size="large"
                        resize="vertical"
                        style={{ height: '300px' }}
                        value={issue}
                        onChange={(event) => setIssue(event.target.value)}
                    />
                </Box>
                <Box align="center" justify="center">
                    <TextInput
                        placeholder="Your email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <Box align="center" justify="center" margin={{ vertical: 'small' }}>
                        <Button label="Send" onClick={handleSubmit} />
                    </Box>
                </Box>
                {error && <Text color="status-critical">{error}</Text>}
                {success && <Text color="status-ok">{success}</Text>}
            </PageContent>
        </Page>
    );
};

export default ReportForm;