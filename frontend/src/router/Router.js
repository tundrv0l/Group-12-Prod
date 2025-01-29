import React from 'react';

/*
* Name: Router.js
* Author: Parker Clark
* Description: Component that defines routing. 
*   Keeps track of different contexts and other path information.
*/

const RouterContext = React.createContext({});

const Router = ({ children }) => {
  const [path, setPath] = React.useState("/");

  React.useEffect(() => {
    const onPopState = () => setPath(document.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const push = nextPath => {
    if (nextPath !== path) {
      window.history.pushState(undefined, undefined, nextPath);
      setPath(nextPath);
      window.scrollTo(0, 0);
    }
  };

  return (
    <RouterContext.Provider value={{ path, push }}>
      {children}
    </RouterContext.Provider>
  );
};

export { Router, RouterContext };