/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { createTheme, CssBaseline, Paper, TextField, ThemeProvider, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const IngresoCategorias = ({ onSubmitSuccess }) => {
  const [descripcionCategoria, setDescripcionCategoria] = useState('');
  const [errors, setErrors] = useState({});
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const theme = createTheme();

  const handleSuccessDialogClose = () => {
    setIsSuccessDialogOpen(false);
    setDescripcionCategoria(''); 
    setErrors({}); 
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!descripcionCategoria) {
      setErrors({ descripcionCategoria: 'Favor completar campo' });
      return;
    }

    try {
      const response = await axios.post(
        'https://www.easyposdev.somee.com/api/NivelMercadoLogicos/AddCategoria',
        { descripcionCategoria:descripcionCategoria }
      );

      console.log(response.data, 'Response Debug');

      // Show the success dialog
      setIsSuccessDialogOpen(true);

      setDescripcionCategoria('');
      onSubmitSuccess();
    } catch (error) {
      console.log(error.response.data, 'Error Debug');
      // Handle error and display a message
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh', width: '90vw' }}>
        <CssBaseline />

        <Grid item xs={12} sm={8} md={12} component={Paper} elevation={24} square>
          <Box
            sx={{
              my: 1,
              mx: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <h4>Ingreso Categorias</h4>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={12}>
                  <TextField
                    autoComplete="off"
                    name="descripcionCategoria"
                    required
                    fullWidth
                    id="descripcionCategoria"
                    label="Nombre Categoría"
                    error={!!errors.descripcionCategoria}
                    helperText={errors.descripcionCategoria}
                    value={descripcionCategoria}
                    onChange={(e) => setDescripcionCategoria(e.target.value)}
                    autoFocus
                  />
                </Grid>
                <Button
                  type="submit"
                  size="md"
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Guardar
                </Button>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onClose={handleSuccessDialogClose}>
        <DialogTitle>Guardado </DialogTitle>
        <DialogContent>
         Categoría creada con éxito
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessDialogClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default IngresoCategorias;
