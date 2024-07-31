/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { Button,Dialog,Grid } from "@mui/material";
import Modal from "@mui/material/Modal";
import IngresoUsuarios from "../Componentes/Usuarios/IngresoUsuarios";
import Add from "@mui/icons-material/Add";

import SideBar from "../Componentes/NavBar/SideBar";
import SearchList from "../Componentes/ListaBuscadora/SearchList";

//

export const defaultTheme = createTheme();

export default function Usuarios() {
  const [open, setOpen] = useState(false);
  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
    <CssBaseline />
    <div>
      <Box sx={{ display: "flex" }}>
        <SideBar  />
        <Box sx={{  flex: 1 }}>
          <Button
            variant="outlined"
            sx={{
              my: 1,
              mx: 2,
            }}
            startIcon={<Add />}
            onClick={handleOpenModal}
          >
            Crear usuario
          </Button>
          <SearchList />
        </Box>
      </Box>

      <Dialog open={open} onClose={handleCloseModal}>
        <Grid
          sx={{
          
            top: "50%",
            left: "50%",
            
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            // overflow: "auto",
           
          }}
        >
            <Grid container justifyContent="center" alignItems="center" style={{ height: '90%' }}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <IngresoUsuarios onClose={handleCloseModal} />
          </Grid>
        </Grid>
        </Grid>
      </Dialog>
    </div>
  </ThemeProvider>

  );
}
