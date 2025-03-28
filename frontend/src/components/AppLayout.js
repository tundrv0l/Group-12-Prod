import React, { useEffect } from 'react';
import { Grommet, Page, PageContent } from 'grommet';
import { useLocation } from 'react-router-dom';
import customTheme from '../theme';

/*
* Name: AppLayout.js
* Author: Parker Clark
* Description: Component that wraps the app in a specified layout.
*/ 

const AppLayout = ({ children }) => {
  // Get current location object
  const location = useLocation();
  
  // Reset scroll position when route changes
  useEffect(() => {
    // Multiple methods to ensure scroll reset works across different browsers
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Some browsers might need a small delay for this to work reliably
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, [location?.pathname]); // Only run when pathname changes
  
  return (
    <Grommet theme={customTheme} full>
      <Page>
        <PageContent align="center">{children}</PageContent>
      </Page>
    </Grommet>
  );
};

export default AppLayout;