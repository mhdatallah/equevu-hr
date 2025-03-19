import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Box,
  TextField,
  MenuItem,
  TablePagination,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';

interface Candidate {
  id: number;
  full_name: string;
  date_of_birth: string;
  years_of_experience: number;
  department: string;
}

interface CandidateResponse {
  count: number;
  results: Candidate[];
}

const departments = [
  { value: '', label: 'All Departments' },
  { value: 'IT', label: 'IT' },
  { value: 'HR', label: 'HR' },
  { value: 'FINANCE', label: 'Finance' },
];

const CandidateList = () => {
  const [department, setDepartment] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, error } = useQuery({
    queryKey: ['candidates', department, page],
    queryFn: async () => {
      const response = await axios.get<CandidateResponse>(
        `${import.meta.env.VITE_API_URL}/candidates/`,
        {
          headers: {
            'X-ADMIN': '1',
          },
          params: {
            department: department || undefined,
            page: page + 1,
          },
        }
      );
      return response.data;
    },
  });

  const handleDownloadResume = async (id: number) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/candidates/${id}/resume/`,
        {
          headers: {
            'X-ADMIN': '1',
          },
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading resume:', error);
    }
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Alert severity="error">Error loading candidates</Alert>;
  }

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Candidates List
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          select
          label="Filter by Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          {departments.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Years of Experience</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.results.map((candidate: Candidate) => (
              <TableRow key={candidate.id}>
                <TableCell>{candidate.full_name}</TableCell>
                <TableCell>
                  {format(new Date(candidate.date_of_birth), 'PP')}
                </TableCell>
                <TableCell>{candidate.years_of_experience}</TableCell>
                <TableCell>{candidate.department}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleDownloadResume(candidate.id)}
                  >
                    Download Resume
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={data?.count || 0}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />
    </Paper>
  );
};

export default CandidateList; 