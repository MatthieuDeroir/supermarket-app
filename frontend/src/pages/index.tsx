import { NextPage } from 'next';
import Home from '@modules/home/Home';
import { Box } from '@mui/material';

const Index: NextPage = () => {
  return (
    <>
      <Box>
        <Home />
      </Box>
    </>
  );
};

export default Index;
