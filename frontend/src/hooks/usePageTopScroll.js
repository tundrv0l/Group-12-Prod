import { useLayoutEffect, useRef, useState } from 'react';

/*
* Name: usePageTopScroll.js
* Author: Parker Clark
* Description: A hook to ensure the scroll position is at the top of the page
*/

export const usePageTopScroll = () => {
  const topRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useLayoutEffect(() => {
    // Scroll immediately before painting
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Mark as scrolled
    setIsScrolled(true);
    
    // Backup scrolling with a small delay
    const timer = setTimeout(() => {
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  return { topRef, isScrolled };
};