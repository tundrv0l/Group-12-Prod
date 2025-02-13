import React, { Children } from 'react';
import { RouterContext } from './Router';

/*
* Name: Routes.js
* Author: Parker Clark
* Description: A parent component for route. Derives context from Router.
*   Maintain a list of routes and their paths, and render the appropriate child component.
*/

const Routes = ({ children }) => {
  const { path: contextPath } = React.useContext(RouterContext);
  let found;
  Children.forEach(children, child => {
    if (!found && contextPath === child.props.path) found = child;
  });
  return found;
};

export default Routes;