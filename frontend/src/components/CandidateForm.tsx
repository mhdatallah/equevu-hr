import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Alert,
  Paper,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';

interface CandidateFormData {
  full_name: string;
  date_of_birth: Date;
  years_of_experience: number;
  department: string;
  resume: FileList;
}

const departments = [
  { value: 'IT', label: 'IT' },
  { value: 'HR', label: 'HR' },
  { value: 'FINANCE', label: 'Finance' },
];

const CandidateForm = () => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CandidateFormData>();

  const mutation = useMutation({
    mutationFn: async (data: CandidateFormData) => {
      const formData = new FormData();
      formData.append('full_name', data.full_name);
      formData.append('date_of_birth', data.date_of_birth.toISOString().split('T')[0]);
      formData.append('years_of_experience', data.years_of_experience.toString());
      formData.append('department', data.department);
      if (data.resume[0]) {
        formData.append('resume', data.resume[0]);
      }

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/candidates/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      setSubmitSuccess(true);
      setSubmitError(null);
      reset();
      setTimeout(() => setSubmitSuccess(false), 5000);
    },
    onError: (error: any) => {
      setSubmitError(
        error.response?.data?.detail || 'An error occurred while submitting the form.'
      );
    },
  });

  const onSubmit = (data: CandidateFormData) => {
    setSubmitError(null);
    mutation.mutate(data);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Candidate Registration
      </Typography>

      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Registration successful!
        </Alert>
      )}

      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="full_name"
          control={control}
          rules={{ required: 'Full name is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              margin="normal"
              fullWidth
              label="Full Name"
              error={!!errors.full_name}
              helperText={errors.full_name?.message}
            />
          )}
        />

        <Controller
          name="date_of_birth"
          control={control}
          rules={{ required: 'Date of birth is required' }}
          render={({ field }) => (
            <DatePicker
              label="Date of Birth"
              value={field.value}
              onChange={(date) => field.onChange(date)}
              slotProps={{
                textField: {
                  margin: 'normal',
                  fullWidth: true,
                  error: !!errors.date_of_birth,
                  helperText: errors.date_of_birth?.message,
                },
              }}
            />
          )}
        />

        <Controller
          name="years_of_experience"
          control={control}
          rules={{
            required: 'Years of experience is required',
            min: { value: 0, message: 'Years must be non-negative' },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              margin="normal"
              fullWidth
              label="Years of Experience"
              error={!!errors.years_of_experience}
              helperText={errors.years_of_experience?.message}
            />
          )}
        />

        <Controller
          name="department"
          control={control}
          rules={{ required: 'Department is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              select
              margin="normal"
              fullWidth
              label="Department"
              error={!!errors.department}
              helperText={errors.department?.message}
            >
              {departments.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="resume"
          control={control}
          rules={{
            required: 'Resume is required',
            validate: {
              fileType: (files) => {
                if (!files[0]) return true;
                const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                return validTypes.includes(files[0].type) || 'Please upload a PDF or DOCX file';
              },
              fileSize: (files) => {
                if (!files[0]) return true;
                return files[0].size <= 5 * 1024 * 1024 || 'File size must be less than 5MB';
              },
            },
          }}
          render={({ field: { onChange, value, ...field } }) => (
            <TextField
              {...field}
              type="file"
              inputProps={{
                accept: '.pdf,.docx',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  onChange(e.target.files);
                },
              }}
              margin="normal"
              fullWidth
              error={!!errors.resume}
              helperText={errors.resume?.message}
            />
          )}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Submitting...' : 'Submit Application'}
        </Button>
      </Box>
    </Paper>
  );
};

export default CandidateForm; 