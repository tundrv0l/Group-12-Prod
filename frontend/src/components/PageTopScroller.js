import React from 'react';
import { Page } from 'grommet';
import { usePageTopScroll } from '../hooks/usePageTopScroll';

/*
* Name: PageTopScroller.js
* Author: Parker Clark
* Description: A component to ensure the page renders properly at the top for scrolling
*/


const PageTopScroller = ({ children }) => {
  const { topRef, isScrolled } = usePageTopScroll();
  
  // First render - minimal content to establish page
  if (!isScrolled) {
    return (
      <Page>
        <div ref={topRef} style={{ height: 0, margin: 0, padding: 0 }} />
        {/* Empty div with height to establish proper page dimensions */}
        <div style={{ height: '100vh' }} />
      </Page>
    );
  }
  
  // Second render - actual content after scroll position is set
  return (
    <Page>
      <div ref={topRef} style={{ height: 0, margin: 0, padding: 0 }} />
      {children}
    </Page>
  );
};

export default PageTopScroller;