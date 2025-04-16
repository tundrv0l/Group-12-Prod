import React from 'react';
import { Footer, Text, Box } from 'grommet';
import { Link, useNavigate } from 'react-router-dom';
import { Configure } from 'grommet-icons';

/*
* Name: ReportFooter.js
* Author: Parker Clark
* Description: Component that makes the footer for each page.
*/ 

const ReportFooter = () => {
  const navigate = useNavigate();
  
  return (
    <Footer 
      align="center" 
      direction="row" 
      flex={false} 
      justify="between" 
      background={{"dark":false}} 
      pad="medium"
      width="100%"
    >
      <Box> 
        <Configure 
          size="medium" 
          color="dark-1" 
          onClick={() => navigate('/admin')} 
          style={{ cursor: 'pointer', opacity: 0.6 }}
        />
      </Box>
      
      <Box direction="row" gap="xxsmall" align="center">
        <Text>
          Found an Issue? Please report it
        </Text>
        <Link to="/report-form" style={{ textDecoration: 'none' }}>
          <Text color="brand" style={{ cursor: 'pointer' }}>
            here!
          </Text>
        </Link>
      </Box>
      
      <Box> </Box>
    </Footer>
  );
};

export default ReportFooter;