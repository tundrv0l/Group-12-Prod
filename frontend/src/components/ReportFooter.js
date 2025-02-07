import React from 'react';
import {Footer, Text, Anchor} from 'grommet';

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
        <Anchor label="here!" gap="none" />
    </Footer>
);

export default ReportFooter;
