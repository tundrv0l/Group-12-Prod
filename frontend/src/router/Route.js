import React from 'react';
import { RouterContext } from './Router';

/*
* Name: Route.js
* Author: Parker Clark
* Description: Component that maintains a single route.
*   It will render if the path matches the current path.
*/

const Route = ({ Component, path }) => {
  const { path: contextPath } = React.useContext(RouterContext);
  return contextPath === path ? <Component /> : null;
};

export default Route;