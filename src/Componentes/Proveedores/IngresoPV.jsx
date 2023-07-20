/* eslint-disable no-unused-vars */
import React from 'react'
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import axios from "axios";
import  { useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Tooltip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"


const defaultTheme = createTheme();


const IngresoPV = () => {
  const [rut, setRut] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [giro, setGiro] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [comuna, setComuna] = useState("");
  const [sucursal, setSucursal] = useState("");
  const [urlPagina, setUlrPagina] = useState("");
  const [formaPago, setFormaPago] = useState("");
 
  const [codigoUsuario, setCodigoUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [remuneracion, setRemuneracion] = useState("");
  const [credito, setCredito] = useState("");
  const [errors, setErrors] = useState({}); //error como objetos
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = {};

    //Validaciones
    if (!rut) {
      errors.rut = "Favor completar campo";
    } else if (
      !/^([1-9]|[1-9]\d|[1-9]\d{2})((\.\d{3})*|(\d{3})*)-(\d|k|K)$/.test(rut)
    ) {
      errors.rut = "Ingresa tu rut con puntos y guión";
    }

    if (!razonSocial) {
      errors.razonSocial = "Favor completar campo ";
    }
    if (!sucursal) {
      errors.sucursal = "Favor completar campo ";
    }
    if (!email) {
      errors.email = "Favor completar campo ";
    }else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,8}$/.test(email)){
      errors.email = "Formato de email no es válido"

    }
    if (!direccion) {
      errors.direccion = "Favor completar campo ";
    }
    if (!telefono) {
      errors.telefono = "Favor completar campo ";
    }
    if (!comuna) {
      errors.comuna = "Favor completar campo ";
    }
    if (!giro) {
      errors.giro = "Favor completar campo ";
    }
    if (!urlPagina) {
      errors.urlPagina = "Favor completar campo ";
    }
    if (!rut) {
      errors.rut = "Favor completar campo ";
    }
    if (!formaPago) {
      errors.formaPago = "Favor completar campo ";
    }
    

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    } else {
      const cliente = {
        razonSocial,
        giro,
        email,
        direccion,
        telefono,
        comuna,
        urlPagina,
        formaPago,
        rut,
       
      };
      console.log(cliente);

      try {
        const response = await axios.post(
          "https://www.easyposdev.somee.com/Usuarios/AddUsuario",
          cliente
        );
        console.log(response.data.descripcion,'debugMiltoco')

      
       
        Swal.fire({
          icon: 'success',
          title: 'Todo en orden',
          text: (response.data.descripcion)
          
        })
        

      } catch (error) {
        console.log(error.response.data, "Leer Error");
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          text:(error.response.data.descripcion),
          title: (error.response.data.descripcion),
          
          
        })
        
        
      }
    }
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh",width: "190vh" }}>
        <CssBaseline />

        <Grid
          item
          xs={1}
          sm={8}
          md={14}
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
            <h4>Ingreso Clientes</h4>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 2 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    autoComplete="razgiro"
                    name="razonsocial"
                    required
                    fullWidth
                    id="razonsocial"
                    label="Razón Social"
                    error={!!errors.razonSocial} //!!Vacio o falso
                    helperText={errors.razonSocial}
                    value={razonSocial}
                    onChange={(e) => setRazonSocial(e.target.value)}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    required
                    fullWidth
                    id="giro"
                    label="Giro"
                    error={!!errors.giro} //!!Vacio o falso
                    helperText={errors.giro}
                    name="giro"
                    value={giro}
                    onChange={(e) => setGiro(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    required
                    fullWidth
                    id="rut"
                    label="Ingrese rut"
                    name="rut"
                    value={rut}
                    onChange={(e) => setRut(e.target.value)}
                    error={!!errors.rut}
                    helperText={errors.rut}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {rut &&
                          /^([1-9]|[1-9]\d|[1-9]\d{2})((\.\d{3})*|(\d{3})*)-(\d|k|K)$/.test(
                            rut
                          ) ? (
                            <Tooltip title="Correct rut format" placement="top">
                              <CheckCircleIcon style={{ color: "green" }} />
                            </Tooltip>
                          ) : null}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                    fullWidth
                    id="email"
                    label="Correo Electrónico"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {email &&
                          /^[\w-.]+@([\w-]+\.)+[\w-]{2,8}$/.test(
                            email
                          ) ? (
                            <Tooltip title="Correct rut format" placement="top">
                              <CheckCircleIcon style={{ color: "green" }} />
                            </Tooltip>
                          ) : null}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField  
                    error={!!errors.telefono}
                    helperText={errors.telefono}
                    required
                    fullWidth
                    name="telefono"
                    label="Teléfono"
                    type="text"
                    id="telefono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    error={!!errors.direccion}
                    helperText={errors.direccion}
                    required
                    fullWidth
                    name="direccion"
                    label="Dirección"
                    type="text"
                    id="direccion"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    error={!!errors.comuna}
                    helperText={errors.comuna}
                    required
                    fullWidth
                    name="comuna"
                    label="Comuna"
                    type="text"
                    id="comuna"
                    value={comuna}
                    onChange={(e) => setComuna(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    error={!!errors.urlPagina}
                    helperText={errors.urlPagina }
                    required
                    fullWidth
                    name="urlPagina"
                    label="urlPagina"
                    type="text"
                    id="urlPagina"
                    value={urlPagina}
                    onChange={(e) => setUlrPagina(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    required
                    fullWidth
                    error={!!errors.formaPago}
                    helperText={errors.formaPago}
                    name="formaPago"
                    label="Forma de Pago"
                    type="text"
                    id="formaPago"
                    value={formaPago}
                    onChange={(e) => setFormaPago(e.target.value)}
                  />
                </Grid>
                
                

                
                
              </Grid>

              <Button
                type="submit"
                size="md"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                guardar 
              </Button>
              
              <Grid container></Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
    
  )
}

export default IngresoPV