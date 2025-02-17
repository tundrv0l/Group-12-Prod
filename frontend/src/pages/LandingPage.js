import React from 'react';
import { Page, PageContent, PageHeader, Box, Image } from 'grommet';
import SidebarMenu from '../components/SidebarMenu';
import ReportFooter from '../components/ReportFooter';
import Background from '../components/Background';

/*
* Name: LandingPage.js
* Author: Parker Clark
* Description: Page that defines the landing (home) of the application.
*/

const LandingPage = () => (
  <Page>
    <Background />
    <Box align="center" justify="center" pad="medium" background="white" style={{ position: 'relative', zIndex: 1, width: '55%', margin: 'auto', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <PageContent align="center" skeleton={false} justify="center">
        <Image src="/Alabama-Huntsville_UAH_logo.webp" alt="UAH Logo" style={{ width: '200px', height: 'auto ', marginBottom: 'xxsmall' }} />
        <PageHeader title="Welcome to The Discrete Math Solver!" level="2" margin={{ top: 'xxsmall', bottom: 'xxsmall'}} />
        <SidebarMenu />
        <ReportFooter />
      </PageContent>
    </Box>
  </Page>
);

export default LandingPage;