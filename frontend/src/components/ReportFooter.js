import React from 'react';
import {Footer, Text} from 'grommet';
import { Link } from 'react-router-dom';

/*
* Name: ReportFooter.js
* Author: Parker Clark
* Description: Component that makes the footer for each page.
*/ 

const ReportFooter = ()=> (
    <Footer align="center" direction="row" flex={false} justify="center" gap="xxsmall" background={{"dark":false}} pad="medium">
        <Text>
            Found an Issue? Please report it
        </Text>
        <Link to="/report-form" style={{ textDecoration: 'none' }}>
            <Text color="brand" style={{ cursor: 'pointer' }}>
                here!
            </Text>
        </Link>
    </Footer>
);

export default ReportFooter;
