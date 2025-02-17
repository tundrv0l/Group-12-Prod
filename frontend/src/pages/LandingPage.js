import React from 'react';
import { Page, PageContent, PageHeader } from 'grommet';
import SidebarMenu from '../components/SidebarMenu';
import ReportFooter from '../components/ReportFooter';

/*
* Name: LandingPage.js
* Author: Parker Clark
* Description: Page that defines the landing (home) of the application.
*/

const LandingPage = () => (
  <Page>
    <PageContent align="center" skeleton={false} justify="center">
      <PageHeader title="Welcome to The Discrete Math Solver!" level="2" margin="medium" />
      <SidebarMenu />
      <ReportFooter />
    </PageContent>
  </Page>
);

export default LandingPage;