
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */

import React,{useState} from 'react'
import Box from "@mui/material/Box";
import {Button} from "@mui/material";
import { Modal } from "@mui/material";
import SideBar from '../Componentes/NavBar/SideBar'
import Add from "@mui/icons-material/Add";
import IngresoSubCategoria from '../Componentes/Productos/IngresoSubCategoria';
import SearchListSubCategories from '../Componentes/ListaBuscadora/SearchListSubCategories';





const SubCategorias = () => {

  const [open, setOpen] = useState(false);
  const handleOpenModal = () => {
    setOpen(true);
  };

  // Event handler to close the IngresoPV modal
  const handleCloseModal = () => {
    setOpen(false);
  };
  return (
    <div style={{ display: "flex" }}>
      
      <SideBar />

      <Box  sx={{ flexGrow: 1, p: 3 }}>
      <Button
          variant="outlined"
          color="primary"
          sx={{
            my: 1,
            mx: 2,
          }}
          startIcon={<Add />}
          onClick={handleOpenModal}
        >
          Sub-Categoría
        </Button>
        <SearchListSubCategories/>
       
        <Modal open={open} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              overflow: "auto", // Added scrollable feature
              maxHeight: "90vh", // Adjust as needed
              maxWidth: "90vw", // Adjust as needed
            }}
          >
          <IngresoSubCategoria onClose={handleCloseModal}/>
          </Box>
        </Modal>


       
       
        
        
        

       
        

       
      </Box>
    </div>
  )
}

export default SubCategorias