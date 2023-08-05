/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { Button } from '@mui/material';
import Modal from "@mui/material/Modal";

import AsocCliente from '../Componentes/Card-Modal/AsocCliente.jsx'
import CambiosMasivos from '../Componentes/Card-Modal/CambiosMasivos.jsx';
import Add from "@mui/icons-material/Add";
import CardModal from '../Componentes/Card-Modal/CardModal.jsx';
import SideBar from '../Componentes/NavBar/SideBar.jsx'
import PreciosGenerales from '../Componentes/Card-Modal/PreciosGenerales.jsx';


export const defaultTheme = createTheme();
const Precios = () => {

  const [openPrecios, setOpenPrecios] = useState(false);
  const [openAsocClientes, setOpenAsocClientes] = useState(false);
  const handleOpenModal = () => {
    setOpenPrecios(true);
  };

  const handleCloseModal = () => {
    setOpenPrecios(false);
  };

  const handleOpenModalAsoClientes = () => {
    setOpenAsocClientes(true);
  };

  const handleCloseModalAsoClientes = () => {
    setOpenAsocClientes(false);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      <Box sx={{ display: "flex" }}>
        <SideBar />
        <Button
          variant="outlined"
        
          sx={{
            my: 1,
            mx: 2,
          }}
          startIcon={<Add />}
          onClick={handleOpenModal}
        >
          Precios Generales
        </Button>
        <Button
          variant="outlined"
        
          sx={{
            my: 1,
            mx: 2,
          }}
          startIcon={<Add />}
          onClick={handleOpenModalAsoClientes}
        >
          Asociacion Clientes
        </Button>
      </Box>

      <Modal open={openAsocClientes} onClose={handleCloseModalAsoClientes}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            overflow: "auto",
            maxHeight: "80vh",
            maxWidth: "180vw",
          }}
        >
          <AsocCliente/>
        </Box>
      </Modal>

      <Modal open={openPrecios} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            overflow: "auto",
            maxHeight: "80vh",
            maxWidth: "180vw",
          }}
        >
          <PreciosGenerales />
        </Box>
      </Modal>
    </ThemeProvider>
    
  )
}

export default Precios