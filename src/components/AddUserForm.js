import React, { useState } from 'react';
import * as yup from 'yup';
import { Button, TextField, Box } from '@mui/material';
import { useFormik } from 'formik';
import axios from 'axios';
import { toast } from 'react-toastify';
import { signOut } from 'next-auth/react';
import { getToken } from '@/utilsfunctions/getCredentials';


const AddEditForm = ({ fetchData, user , handleClose }) => {
  const userSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    username: yup.string().required('Username is required'),
    phone: yup.string().required('Number is required'),
    name: yup.string().required('Name is required'),
    website: yup.string().required('website is required'),
  });
  const formik = useFormik({
    initialValues: {
      email: user?.email || '',
      username: user?.username || '',
      phone: user?.phone || '',
      name: user?.name || '',
      website: user?.website || '',
    },
    validationSchema: userSchema,
    onSubmit: async (values) => {
      try {
        if(typeof user === "object"){
          const response = await axios.put(`http://192.168.2.45:3000/user/updateSingleValue/users/${user.id}` ,
          values, 
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          });
          console.log(response);
          if(response.data.status == 200){
            toast.success('User updated successfully');
            fetchData();
            handleClose();
          }else{
            toast.error('Issue with updating user');
            signOut();
            handleClose();
          }
        }else{
          const response = await axios.post(
            "http://192.168.2.45:3000/user/setSingleValue/users",
            values,
            {
              headers: {
                Authorization: `Bearer ${getToken()}`,
              },
            }
          );
          console.log(response);
          if(response.status == 201){
            toast.success('User Added successfully');
            fetchData();
            handleClose();
          }else{
            toast.error('Issue with adding user');
            signOut();
            handleClose();
          }

        }
        console.log(values);
      } catch (err) {
        console.error(err);
        toast.error(err?.response?.data?.message);
        signOut();
        handleClose();
      }
    },
  });

  const { values, errors } = formik;
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
          borderRadius: '3%',
          boxShadow: 24,
          p: 4,
        }}
      >
        <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          style={{ marginBottom: '16px' }}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={values.email}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          fullWidth
          label="Username"
          name="username"
          style={{ marginBottom: '16px' }}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={values.username}
          error={!!errors.username}
          helperText={errors.username}
        />
        <TextField
          fullWidth
          label="Number"
          name="phone"
          style={{ marginBottom: '16px' }}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={values.phone}
          error={!!errors.phone}
          helperText={errors.phone}
        />
        {/* New TextField for Name */}
        <TextField
          fullWidth
          label="Name"
          name="name"
          style={{ marginBottom: '16px' }}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={values.name}
          error={!!errors.name}
          helperText={errors.name}
        />
        {/* New TextField for Website */}
        <TextField
          fullWidth
          label="Website"
          name="website"
          style={{ marginBottom: '16px' }}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={values.website}
          error={!!errors.website}
          helperText={errors.website}
        />
       {typeof user === "object"? <Button variant="contained" type='submit'>
          Update
        </Button>:
        <Button variant="contained" type='submit'>
        Add
      </Button>
        }
        </form>
      </Box>

    </>
  )
}

export default AddEditForm