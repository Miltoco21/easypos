/* eslint-disable no-unused-vars */

import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import axios from "axios";
import React, { useState } from "react";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Navigate, useNavigate } from "react-router-dom";
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

  // const Navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

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
    axios //
      .post(
        "https://788b-2803-9800-b02e-7f0c-b565-992e-c821-d984.ngrok-free.app/Usuarios/PostUsuario",
        usuario
      )
      .then((res) => {
        alert(res.data.message);
      })
      .catch((err, res) => {
        console.log(err.response.data, "Leer Error");
        alert(err.response.data.message);
      });
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
                    name="apellidos"
                    value={apellidos}
                    onChange={(e) => setApellido(e.target.value)}
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
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
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
