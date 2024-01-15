import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { getToken } from '@/utilsfunctions/getCredentials';
import { toast } from 'react-toastify';
import { signOut } from 'next-auth/react';
import { Modal } from '@mui/material';
import AddEditForm from './AddUserForm';


const Table = () => {
    const [rows , setRows] = useState([]);
    const [open, setOpen] = useState(false);


    const fetchData = async() =>{
        const Response = await axios.get('http://localhost:4000/userDetails');

        if(Response.status === 200){
            setRows(Response.data);
        }

        console.log(Response);
    }
    useEffect(()=>{
        fetchData();
    },[])

    const handleEdit = (id) => {
        setOpen(true);
        // Handle edit action, e.g., redirect to edit page
        console.log(`Edit clicked for ID: ${id}`);
      };

      const handleOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
    
      const handleDelete = async(id) => {
        try{
            if(getToken()){
            const response = await axios.delete(`http://localhost:4000/deleteUser/${id}`, {
                headers: {
                  Authorization: `Bearer ${getToken()}`,
                },
              });
              if(response.status == 200){
                fetchData();
              }else{
                toast.error('you are not authenticated');
                setTimeout(() => {
                    signOut()
                }, 1000);
              }
        }else{
            toast.error('you are not authenticated');
            setTimeout(() => {
                signOut()
            }, 1000);
        }
    }catch(err){
        signOut();
    }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 200 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'username', headerName: 'Username', width: 200 },
        { field: 'number', headerName: 'Number', width: 200 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
              <>
                <button onClick={() => handleEdit(params.row.id)}><EditIcon /></button>
                <button onClick={() => handleDelete(params.row.id)}><DeleteOutlineIcon /></button>
              </>
            ),
          },      ];

  return (
    <>
    <div onClick={handleOpen}>ADD User</div>
   <div style={{ height: 400, width: '100vw' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5} // You can adjust the number of rows per page
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
    <Modal open={open} onClose={handleClose}>
        <AddEditForm user={{}}/>
    </Modal>

    </>
  )
}

export default Table