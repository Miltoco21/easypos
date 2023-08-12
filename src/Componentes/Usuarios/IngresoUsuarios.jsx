/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { regionsData } from "./data.js";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import axios from "axios";
import Dialog from "@mui/material/Dialog";

import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";

import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import { MenuItem } from "@mui/material";

import Grid from "@mui/material/Grid";
import { Tooltip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { createTheme, ThemeProvider } from "@mui/material/styles";

//

export const defaultTheme = createTheme();

export default function IngresoUsuarios() {
  const [nombres, setNombre] = useState("");
  const [apellidos, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  const [codigoPostal, setCodigoPostal] = useState("");
  const [rut, setRut] = useState("");
  const [codigoUsuario, setCodigoUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [remuneracion, setRemuneracion] = useState("");
  const [credito, setCredito] = useState("");
  const [errors, setErrors] = useState({
    rut: "",
    nombres: "",
    apellidos: "",
    correo: "",
    direccion: "",
    telefono: "",
    comuna: "",
    selectedRegion: "",
    codigoPostal: "",
    codigoUsuario: "",
    clave: "",
    remuneracion: "",
    credito: "",
  });
  const [modalOpen, setModalOpen] = useState(false);

  const [modalContent, setModalContent] = useState({});
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedComuna, setSelectedComuna] = useState("");
  const [regionOptions, setRegionOptions] = useState([]);
  const [comunaOptions, setComunaOptions] = useState([]);

  const regions = regionsData;

  useEffect(() => {
    // Extraer regiones 
    const regions = regionsData.map((region) => region.name);
    setRegionOptions(regions);
  }, []);

  useEffect(() => {
    // Extraer comuna segun  region seleccionada
    const selectedRegionData = regionsData.find(
      (region) => region.name === selectedRegion
    );
    if (selectedRegionData) {
      const comunas = selectedRegionData.communes.map((comuna) => comuna.name);
      setComunaOptions(comunas);
    } else {
      setComunaOptions([]);
    }
  }, [selectedRegion]);

  const closeModal = () => {
    setModalOpen(false);
    setModalContent("");
    setNombre("");
    setApellido("");
    setCorreo("");
    setTelefono("");
    setDireccion("");
    setSelectedRegion("");
    setSelectedComuna("");
    setCodigoPostal("");
    setRut("");
    setCodigoUsuario("");
    setClave("");
    setRemuneracion("");
    setCredito("");
    // Clear errors
    setErrors({});
  };

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
      errors.nombres = "Favor completar nombres ";
    }
    if (!apellidos) {
      errors.apellidos = "Favor completar apeliidos ";
    }
    if (!correo) {
      errors.correo = "Favor completar email ";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,8}$/.test(correo)) {
      errors.correo = "Formato de correo no es válido";
    }
    if (!direccion) {
      errors.direccion = "Favor completar dirección ";
    }
    if (!telefono) {
      errors.telefono = "Favor completar telefono ";
    }
    if (!selectedComuna || selectedComuna.length === 0) {
      errors.comuna = "Favor completar comuna ";
    }
    if (!selectedRegion) {
      errors.selectedRegion = "Favor completar región ";
    }
    if (!codigoPostal) {
      errors.codigoPostal = "Favor completar codigo postal ";
    }
    if (!rut) {
      errors.rut = "Favor completar rut ";
    }
    if (!codigoUsuario) {
      errors.codigoUsuario = "Favor completar código  ";
    }
    if (!clave) {
      errors.clave = "Favor completar clave ";
    }
    if (!remuneracion) {
      errors.remuneracion = "Favor completar remuneración ";
    }
    if (!credito) {
      errors.credito = "Favor completar crédito ";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    } else {
      const usuario = {
        nombres,
        apellidos,
        correo,
        direccion,
        telefono,
        region: selectedRegion,
        comuna: selectedComuna,
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
        console.log(response.data.descripcion, "debugMiltoco");
        setModalContent({
          description: response.data.descripcion,
          positive: true,
        });
        setModalOpen(true);
      } catch (error) {
        console.log(error.response.data, "Leer Error");
        setModalContent({
          description: error.response.data.descripcion,
          positive: false,
        });
        setModalOpen(true);
      }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "70vh", width: "1200px" }}>
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
          <Box
            sx={{
              my: 8,
              mx: 4,

              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h2>Crea nuevo usuario</h2>
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
                    error={!!errors.correo}
                    helperText={errors.correo}
                    required
                    fullWidth
                    id="correo"
                    label="Correo Electrónico"
                    name="correo"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {correo &&
                          /^[\w-.]+@([\w-]+\.)+[\w-]{2,8}$/.test(correo) ? (
                            <Tooltip title="Email Correcto" placement="top">
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
                    fullWidth
                    required
                    select
                    label="Región"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    error={!!errors.selectedRegion}
                    helperText={errors.selectedRegion}
                    
                  >
                    
                    <MenuItem value="">
                      <em>Selecciona...</em>
                    </MenuItem>
                    {regionOptions.map((region) => (
                      <MenuItem key={region} value={region}>
                        {region}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    required
                    fullWidth
                    select
                    label="Comuna"
                    value={selectedComuna}
                    onChange={(e) => setSelectedComuna(e.target.value)}
                    error={!!errors.comuna}
                    helperText={errors.comuna}
                  >
                    {" "}
                    <MenuItem value="">
                      <em>Selecciona...</em>
                    </MenuItem>
                    {comunaOptions.map((comuna) => (
                      <MenuItem key={comuna} value={comuna}>
                        {comuna}
                      </MenuItem>
                    ))}
                  </TextField>
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

              <Grid container></Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Dialog open={modalOpen} onClose={closeModal}>
        <DialogContent>
          <DialogContentText>
            {modalContent.positive ? (
              <span style={{ color: "green" }}>Guardado con éxito</span>
            ) : (
              <span style={{ color: "red" }}>Error al guardar</span>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
