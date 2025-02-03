import React from 'react';
import { PageHeader } from 'grommet';

/*
* Name: PageHeader.js
* Author: Parker Clark
* Description: Component that establishes a Page Header for pages.
*/ 

const PageHeaderComponent = ({ title }) => (
  <PageHeader title={title} level="2" margin="medium" />
);

export default PageHeaderComponent;
