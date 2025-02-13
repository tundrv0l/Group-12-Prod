import React from 'react';
import { Grommet, Page, PageContent } from 'grommet';

/*
* Name: AppLayout.js
* Author: Parker Clark
* Description: Component that wraps the app in a specified layout.
*/ 

const AppLayout = ({ children }) => (
  <Grommet full>
    <Page>
      <PageContent align="center">{children}</PageContent>
    </Page>
  </Grommet>
);

export default AppLayout;