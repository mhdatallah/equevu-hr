import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import theme from './theme';
import CandidateForm from './components/CandidateForm';
import CandidateList from './components/CandidateList';
import Layout from './components/Layout';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<CandidateForm />} />
                <Route path="/admin" element={<CandidateList />} />
              </Routes>
            </Layout>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App; 