/* eslint-disable no-unused-vars */

import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import axios from "axios";
import React, { useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Tooltip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"
import Navegacion from "../Componentes/NavBar/Navegacion";


// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Usuarios() {
  const [nombres, setNombre] = useState("");
  const [apellidos, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [comuna, setComuna] = useState("");
  const [region, setRegion] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [rut, setRut] = useState("");
  const [codigoUsuario, setCodigoUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [remuneracion, setRemuneracion] = useState("");
  const [credito, setCredito] = useState("");
  const [errors, setErrors] = useState({}); //error como objetos

  // const Navigate = useNavigate();

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

    if (!nombres) {
      errors.nombres = "Favor completar campo ";
    }
    if (!apellidos) {
      errors.apellidos = "Favor completar campo ";
    }
    if (!email) {
      errors.email = "Favor completar campo ";
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
    if (!region) {
      errors.region = "Favor completar campo ";
    }
    if (!codigoPostal) {
      errors.codigoPostal = "Favor completar campo ";
    }
    if (!rut) {
      errors.rut = "Favor completar campo ";
    }
    if (!codigoUsuario) {
      errors.codigoUsuario = "Favor completar campo ";
    }
    if (!clave) {
      errors.clave = "Favor completar campo ";
    }
    if (!remuneracion) {
      errors.remuneracion = "Favor completar campo ";
    }
    if (!credito) {
      errors.credito = "Favor completar campo ";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    } else {
      const usuario = {
        nombres,
        apellidos,
        email,
        direccion,
        telefono,
        comuna,
        region,
        codigoPostal,
        rut,
        codigoUsuario,
        clave,
        remuneracion,
        credito,
      };
      console.log(usuario);

      try {
        const response = await axios.post(
          "https://www.easyposdev.somee.com/Usuarios/AddUsuario",
          usuario
        );

      
       
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: (response.data.message),
          showConfirmButton: false,
          timer: 1500
        })
        

      } catch (error) {
        console.log(error.response.data, "Leer Error");
        alert(error.response.data.message);
        
      }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />

        <Grid
          item
          xs={12}
          sm={8}
          md={12}
          component={Paper}
          elevation={6}
          square
        >
          <Navegacion />
          <Box
            sx={{
              my: 8,
              mx: 4,

              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    autoComplete="given-name"
                    name="nombres"
                    required
                    fullWidth
                    id="nombre"
                    label="Nombres"
                    error={!!errors.nombres} //!!Vacio o falso
                    helperText={errors.nombres}
                    value={nombres}
                    onChange={(e) => setNombre(e.target.value)}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    required
                    fullWidth
                    id="apellido"
                    label="Apellidos"
                    error={!!errors.apellidos} //!!Vacio o falso
                    helperText={errors.apellidos}
                    name="apellidos"
                    value={apellidos}
                    onChange={(e) => setApellido(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    require
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
                    error={!!errors.region}
                    helperText={errors.region }
                    required
                    fullWidth
                    name="region"
                    label="Región"
                    type="text"
                    id="region"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    required
                    fullWidth
                    error={!!errors.codigoPostal}
                    helperText={errors.codigoPostal}
                    name="codigoPostal"
                    label="Código Postal"
                    type="text"
                    id="codigoPostal"
                    value={codigoPostal}
                    onChange={(e) => setCodigoPostal(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    required
                    fullWidth
                    error={!!errors.codigoUsuario}
                    helperText={errors.codigoUsuario}
                    name="codigousuario"
                    label="Código Usuario"
                    type="text"
                    id="codigousuario"
                    value={codigoUsuario}
                    onChange={(e) => setCodigoUsuario(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    error={!!errors.clave}
                    helperText={errors.clave}
                    required
                    fullWidth
                    name="clave"
                    label="Clave Usuario"
                    type="text"
                    id="clave"
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    error={!!errors.remuneracion}
                    helperText={errors.remuneracion}
                    required
                    fullWidth
                    name="remuneracion"
                    label="Remuneración"
                    type="text"
                    id="remuneracion"
                    value={remuneracion}
                    onChange={(e) => setRemuneracion(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    error={!!errors.credito}
                    helperText={errors.credito}
                    required
                    fullWidth
                    name="credito"
                    label="Crédito"
                    type="text"
                    id="credito"
                    value={credito}
                    onChange={(e) => setCredito(e.target.value)}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                size="md"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                guardar usuario
              </Button>
              {/* <Button
                type=""
                md
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
               Editar
              </Button>
              <Button
                type=""
                md
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
               Borrar
              </Button> */}
              <Grid container></Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
