/* eslint-disable react/prop-types */

/* eslint-disable no-unused-vars */
import React, { useState,useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import {
 
  CssBaseline,
  Paper,
  TextField,
  
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();


const IngresoCategorias = ({ onSubmitSuccess }) => {
  const [descripcionCategoria, setDescripcionCategoria] = useState("");
  const [errors, setErrors] = useState({});
  

  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  

  

  useEffect(() => {
    if (responseDialogOpen) {
      setResponseMessage('Categoría creada con éxito');
    } else {
      setResponseMessage('Error al crear la categoría');
    }
  }, [responseDialogOpen]);



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!descripcionCategoria) {
      setErrors({ descripcionCategoria: "Favor completar campo" });
      return;
    }

    try {
      const response = await axios.post(
        'https://www.easyposdev.somee.com/api/NivelMercadoLogicos/AddCategoria',
        { descripcionCategoria:descripcionCategoria }
      );
    
      if (response.data.statusCode === 201) {
        console.log(response.data, 'Response Debug');
        // Open the dialog
        setResponseDialogOpen(true);
        setDescripcionCategoria('');
        ///onSubmitSuccess();
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log(error.response.data, 'Error Debug');
      // Open the dialog
      setResponseDialogOpen(true);
    }
    
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "60vh", width: "60vw" }}>
        <CssBaseline />

        <Grid
          item
          xs={12}
          sm={8}
          md={12}
          component={Paper}
          elevation={24}
          square
        >
          <Box
            sx={{
              my: 1,
              mx: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h4>Ingreso Categorias</h4>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 2 }}
            >
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
      <Dialog
        open={responseDialogOpen}
        onClose={() => setResponseDialogOpen(false)}
      >
       
        <DialogContent>
          <DialogContentText>{responseMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResponseDialogOpen(false)} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default IngresoCategorias;
