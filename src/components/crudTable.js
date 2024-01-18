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
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);


    const fetchData = async() =>{
        const Response = await axios.get('http://192.168.2.45:3000/user/users');

        if(Response.status === 200){
            setRows(JSON.parse(Response.data.data).users);
        }

        console.log(JSON.parse(Response.data.data));
    }
    useEffect(()=>{
        fetchData();
    },[])

    const handleEdit = (id) => {
      const user = rows.find((row) => row.id === id);
      setSelectedUser(user);

        setOpenEdit(true);
        // Handle edit action, e.g., redirect to edit page
        console.log(`Edit clicked for ID: ${id}`);
      };

      const handleOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
        setOpenEdit(false);
      };
    
      const handleDelete = async(id) => {
        try{
            if(getToken()){
            const response = await axios.delete(`http://192.168.2.45:3000/user/removeSingleValue/users/${id}`, {
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
        { field: 'id', headerName: 'ID', width :80},
        { field: 'name', headerName: 'Name' , width : 150},
        { field: 'email', headerName: 'Email', width : 150},
        { field: 'username', headerName: 'Username', width : 150},
        { field: 'phone', headerName: 'Number', width : 150},
        { field: 'website', headerName: 'Website', width : 150},
        {
            field: 'actions',
            headerName: 'Actions',
            width : 150,
            renderCell: (params) => (
              <>
                <button onClick={() => handleEdit(params.row.id)}><EditIcon /></button>
                <button onClick={() => handleDelete(params.row.id)}><DeleteOutlineIcon /></button>
              </>
            ),
          },      ];

  return (
    <>
    <button className='bg-blue-500 p-2 font-bold text-[white] ml-4 mb-2 rounded-md' onClick={handleOpen}>ADD User</button>
   <div style={{ height: '600' ,width : '100vw' , overflowX : 'auto'  }}>
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
        <AddEditForm fetchData={fetchData} handleClose={handleClose}/>
    </Modal>
    <Modal open={openEdit} onClose={handleClose}>
        <AddEditForm fetchData={fetchData} user={selectedUser} handleClose={handleClose}/>
    </Modal>

    </>
  )
}

export default Table