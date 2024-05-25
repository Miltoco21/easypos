import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Importar el icono
import SideBar from '../Componentes/NavBar/SideBar';
import Card2 from '../Componentes/Home/Card2';

const defaultTheme = createTheme();

const Home = ({ userData, setUserData }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUserData(null);
    sessionStorage.clear(); // Limpiar sessionStorage
    navigate('/login');
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <SideBar />
        <Box sx={{ flex: 1, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">
              Bienvenido, {userData ? `${userData.nombres} ${userData.apellidos}` : 'Usuario'}
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={handleClickOpen}
              startIcon={<ExitToAppIcon />}
            >
              Cerrar Sesión
            </Button>
          </Box>
          <Typography variant="h6">
            Rol: {userData ? userData.rol : 'rol'}
          </Typography>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Confirmar Cierre de Sesión"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                ¿Estás seguro de que deseas cerrar sesión?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancelar
              </Button>
              <Button onClick={handleLogout} color="primary" autoFocus>
                Cerrar Sesión
              </Button>
            </DialogActions>
          </Dialog>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card2 />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card2 />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Home;