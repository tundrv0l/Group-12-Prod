import React from 'react';
import { Box, Button } from 'grommet';
import { FormPrevious } from 'grommet-icons';
import { useNavigate } from 'react-router-dom';

const HomeButton = () => {
  const navigate = useNavigate();

  const navigateHome = () => {
    navigate('/');
  };

  return (
    <Box align="start" pad="small">
      <Button icon={<FormPrevious />} onClick={navigateHome} />
    </Box>
  );
};

export default HomeButton;