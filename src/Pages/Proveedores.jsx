/* eslint-disable no-unused-vars */
import React,{useState} from 'react'
import Navegacion from '../Componentes/NavBar/Navegacion'
import Button from "@mui/joy/Button";
import Add from "@mui/icons-material/Add";
import Modal from "@mui/joy/Modal";
import Box from "@mui/material/Box";
import IngresoPV from '../Componentes/Proveedores/IngresoPV';
import { blue } from '@mui/material/colors';



const Proveedores = () => {
  const [open, setOpen] = useState(false);
  const text = "Proovedores";
  const uppercaseText = text.toUpperCase();
  return (
    <>  
      <Navegacion/>
      <Button
        variant="outlined"
        
        

        

        color="neutral"
        sx={{
          my: 1,
          mx: 2,
          
         
        }}
        startDecorator={<Add />}
        onClick={() => setOpen(true)}
      >
        {uppercaseText}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
      <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            overflow: 'auto', // Added scrollable feature
            maxHeight: '100vh', // Adjust as needed
            maxWidth: '180vw', // Adjust as needed
          }}
        >
          <IngresoPV/>
        </Box>
        
      </Modal>
      
    
    
    </>
  )
}

export default Proveedores