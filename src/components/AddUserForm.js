import React, { useState } from 'react';
import * as yup from 'yup';
import { Button , TextField, Box } from '@mui/material';


const AddEditForm = ({user}) => {
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        email: user.email || '',
        username: user.username || '',
        number: user.number || '',
      });


const userSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  username: yup.string().required('Username is required'),
  number: yup.string().required('Number is required'),
});


const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };



    const handleSubmit = async () => {
        try {
          await userSchema.validate(formData, { abortEarly: false });
          addUser(formData);
          handleClose();
        } catch (validationErrors) {
          const errors = {};
          validationErrors.inner.forEach((error) => {
            errors[error.path] = error.message;
          });
          setErrors(errors);
        }
      };
  return (
    <>
    <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            borderRadius : '3%',
            boxShadow: 24,
            p: 4,
          }}
        >
          <TextField
            fullWidth
            label="Email"
            name="email"
            style={{ marginBottom: '16px' }}
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            fullWidth
            label="Username"
            name="username"
            style={{ marginBottom: '16px' }}
            value={formData.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
          />
          <TextField
            fullWidth
            label="Number"
            name="number"
            style={{ marginBottom: '16px' }}
            value={formData.number}
            onChange={handleChange}
            error={!!errors.number}
            helperText={errors.number}
          />
          <Button variant="contained" onClick={handleSubmit}>
            Add
          </Button>
        </Box>
    </>
  )
}

export default AddEditForm