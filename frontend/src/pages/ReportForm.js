import React, { useState } from 'react';
import { Page, PageContent, Box, Text, TextInput, Button, TextArea, Spinner } from 'grommet';
import { reportProblem } from '../api';
import HomeButton from '../components/HomeButton';
import Background from '../components/Background';

/*
* Name: ReportForm.js
* Author: Parker Clark
* Description: Form to report issues to the webmaster
*/

const ReportForm = () => {
    const [email, setEmail] = useState('');
    const [issue, setIssue] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleSubmit = async () => {
        if (!email || !issue) {
            setError('Please fill in both fields.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        console.log(email);

        if (!validateAddress(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        try {
            const response = await reportProblem(email, issue);
            
            setLoading(false);

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

    // Validate email format
    const validateAddress = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    return (
        <Page>
            <Background />
            <Box align="center" justify="center" pad="medium" background="white" style={{ position: 'relative', zIndex: 1, width: '55%', margin: 'auto', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <PageContent align="center" skeleton={false} justify="center">
                <Box align="start" style={{ position: 'absolute', top: 0, left: 0, padding: '10px', background: 'white', borderRadius: '8px' }}>
                    <HomeButton />
                </Box>
                    <Box align="center" justify="center" pad={{ vertical: 'medium' }}>
                        <Text size="xxlarge" weight="bold">
                            Problem Report Contact Page
                        </Text>
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
                            <Button label={loading ? <Spinner /> : "Solve"} onClick={handleSubmit} disabled={loading} />
                        </Box>
                    </Box>
                    {error && <Text color="status-critical">{error}</Text>}
                    {success && <Text color="status-ok">{success}</Text>}
                </PageContent>
            </Box>
        </Page>
    );
};

export default ReportForm;