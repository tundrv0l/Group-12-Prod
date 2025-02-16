import React from 'react';
import { Page, PageContent, PageHeader, Footer, Anchor, Text } from 'grommet';
import SidebarMenu from '../components/SidebarMenu';

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
      <Footer align="center" direction="row" flex={false} justify="center" gap="xxsmall" pad="small">
        <Text>
          Found an Issue? Please report it
        </Text>
        <Anchor label="here!" gap="none" />
      </Footer>
    </PageContent>
  </Page>
);

export default LandingPage;