import React from 'react';
import { Box, Collapsible, Button } from 'grommet';
import { CircleInformation } from 'grommet-icons';

/*
* Name: InfoBox.js
* Author: Jacob Warren
* Description: Skeleton for info boxes.
*/

const InfoBox = ({ InfoText }) => {
  const [showHelp, setShowHelp] = React.useState(false);

  return (
    <>
        <Box direction="row" align="start" justify="start" margin={{ bottom: 'small' }} style={{ marginLeft: '-8px', marginTop: '-8px' }}>
          <Button icon={<CircleInformation />} onClick={() => setShowHelp(!showHelp)} plain />
        </Box>
        <Collapsible open={showHelp}>
          <Box pad="small" background="light-2" round="small" margin={{ bottom: "medium" }} width="large">
            <InfoText />
          </Box>
        </Collapsible>
    </>
  );
};

export default InfoBox;
