import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { Button, Dialog } from '@mui/material';
import Add from '@mui/icons-material/Add';

import SideBar from '../Componentes/NavBar/SideBar.jsx';
import AsocCliente from '../Componentes/Card-Modal/AsocCliente.jsx';
import PreciosGenerales from '../Componentes/Card-Modal/PreciosGenerales.jsx';
import BoxBuscador from '../Componentes/Card-Modal/BoxBuscador.jsx';

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

      <Box sx={{ display: 'flex' }}>
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
          Asociación Clientes
        </Button>
      </Box>

      <Dialog open={openAsocClientes} onClose={handleCloseModalAsoClientes}>
        <BoxBuscador onClosePreciosClientes={handleCloseModalAsoClientes}  />
      </Dialog>

      <Dialog open={openPrecios} onClose={handleCloseModal}>
        <PreciosGenerales onClose={handleCloseModal}/>
      </Dialog>
    </ThemeProvider>
  );
};

export default Precios;
