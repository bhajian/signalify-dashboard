import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  CardHeader,
  Divider,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

import MainCard from 'components/MainCard';
import countries from '../../../assets/data/countries';

const TabPersonal = () => {
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);

  const [profile, setProfile] = useState({
    firstname: '',
    lastname: '',
    email: '',
    dob: null,
    phone: '',
    designation: '',
    address: '',
    country: '',
    state: '',
    note: ''
  });

  const [errors, setErrors] = useState({});

  // Fetch Profile Data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('serviceToken')}` }
        });
        setProfile(response.data.profile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setProfile((prev) => ({ ...prev, dob: date }));
  };

  // Handle Form Submission
  const handleSave = async () => {
    const newErrors = {};
    if (!profile.firstname) newErrors.firstname = 'First Name is required';
    if (!profile.lastname) newErrors.lastname = 'Last Name is required';
    
    setErrors(newErrors);
    console.log(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      
      try {
        await axios.put('http://localhost:3001/api/profile', profile, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('serviceToken')}`,
            'Content-Type': 'application/json'
          }
        });
        
      } catch (error) {
        console.error('Error saving profile:', error);
      }
    }
  };

  return (
    <MainCard title="Personal Information">
      <Box sx={{ p: 2.5 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <InputLabel>First Name</InputLabel>
            <TextField
              fullWidth
              name="firstname"
              value={profile.firstname}
              onChange={handleChange}
              error={Boolean(errors.firstname)}
              helperText={errors.firstname}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Last Name</InputLabel>
            <TextField
              fullWidth
              name="lastname"
              value={profile.lastname}
              onChange={handleChange}
              error={Boolean(errors.lastname)}
              helperText={errors.lastname}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Email</InputLabel>
            <TextField
              fullWidth
              name="email"
              value={profile.email}
              onChange={handleChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Date of Birth</InputLabel>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={profile.dob}
                maxDate={maxDate}
                onChange={(date) => handleDateChange(date)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={Boolean(errors.dob)}
                    helperText={errors.dob}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Phone</InputLabel>
            <TextField
              fullWidth
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              error={Boolean(errors.phone)}
              helperText={errors.phone}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Designation</InputLabel>
            <TextField
              fullWidth
              name="designation"
              value={profile.designation}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel>Address</InputLabel>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="address"
              value={profile.address}
              onChange={handleChange}
            />
          </Grid>
          {/* <Grid item xs={12} sm={6}>
            <InputLabel>Country</InputLabel>
            <Select
              fullWidth
              name="country"
              value={profile.country}
              onChange={handleChange}
            >
              {countries.map((item) => (
                <MenuItem key={item.code} value={item.code}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </Grid> */}
          {/* <Grid item xs={12} sm={6}>
            <InputLabel>State</InputLabel>
            <TextField
              fullWidth
              name="state"
              value={profile.state}
              onChange={handleChange}
            />
          </Grid> */}
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Stack>
      </Box>
    </MainCard>
  );
};

export default TabPersonal;
