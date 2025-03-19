import { ReactNode } from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={RouterLink} to="/" sx={{ color: 'white', textDecoration: 'none', flexGrow: 1 }}>
            Equevu HR
          </Typography>
          <Typography component={RouterLink} to="/admin" sx={{ color: 'white', textDecoration: 'none' }}>
            Admin
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout; 