import React from 'react';
import { Page, PageContent, Box, Image, Text, ResponsiveContext } from 'grommet';
import SidebarMenu from '../components/SidebarMenu';
import ReportFooter from '../components/ReportFooter';
import Background from '../components/Background';

/*
* Name: LandingPage.js
* Author: Parker Clark
* Description: Page that defines the landing (home) of the application.
*/

const LandingPage = () => (
  <ResponsiveContext.Consumer>
    {(size) => (
      <Page>
        <Background />
        <Box
          align="center"
          justify="center"
          pad={{ horizontal: size === 'small' ? 'medium' : 'large', vertical: 'medium' }}
          background="white"
          style={{
            position: 'relative',
            zIndex: 1,
            width: size === 'small' ? '80%' : size === 'medium' ? '70%' : 'min(80rem, 75%)',
            minWidth: size == 'large' ? '800px' : 'auto',
            maxWidth: '1200px',
            margin: 'auto',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            overflowX: 'hidden'  // Prevent horizontal overflow
          }}
        >
          <PageContent align="center" skeleton={false} justify="center" style={{ width: '100%' }}>
            <Image
              src="/Alabama-Huntsville_UAH_logo.webp"
              alt="UAH Logo"
              style={{
                width: size === 'small' ? '150px' : '200px',
                height: 'auto',
                marginBottom: 'xxsmall'
              }}
            />
            <Text
              size={size === 'small' ? 'xlarge' : 'xxlarge'}
              weight="bold"
              textAlign="center"
              margin={{ top: 'medium', bottom: 'medium' }}
            >
              Welcome to The Discrete Math Solver!
            </Text>
            <Box width="100%" overflow="hidden">
              <SidebarMenu />
            </Box>
            <ReportFooter />
          </PageContent>
        </Box>
      </Page>
    )}
  </ResponsiveContext.Consumer>
);

export default LandingPage;