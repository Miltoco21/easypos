/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { Button, Typography } from "@mui/material";
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
  const [isEmailValid, setIsEmailValid] = useState(false);
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
    rol: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedComuna, setSelectedComuna] = useState("");
  const [regionOptions, setRegionOptions] = useState([]);
  const [comunaOptions, setComunaOptions] = useState([]);
  const [selectedRol, setSelectedRol] = useState("");
  const [roles, setRoles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get(
          "https://www.easyposdev.somee.com/api/RegionComuna/GetAllRegiones"
        );

        // Store both ID and region name in regionOptions
        setRegionOptions(response.data.regiones);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRegions();
  }, []);

  useEffect(() => {
    const fetchComunas = async () => {
      if (selectedRegion) {
        try {
          const response = await axios.get(
            `https://www.easyposdev.somee.com/api/RegionComuna/GetComunaByIDRegion?IdRegion=${selectedRegion}`
          );
          setComunaOptions(response.data.comunas.map((comuna) => comuna.comunaNombre));
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchComunas();
  }, [selectedRegion]);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const response = await axios.get(
          "https://www.easyposdev.somee.com/Usuarios/GetAllRolUsuario"
        );
        console.log("API response:", response.data.usuarios);
        setRoles(response.data.usuarios);
      } catch (error) {
        console.log(error);
      }
    }

    fetchRoles();
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setCorreo(inputEmail);
    setIsEmailValid(validateEmail(inputEmail));
    if (!inputEmail) {
      setErrors({ correo: "Favor completar email" });
    } else if (!validateEmail(inputEmail)) {
      setErrors({ correo: "Formato de correo no es válido" });
    } else {
      setErrors({ correo: "" });
    }
  };

  useEffect(() => {
    async function fetchRoles() {
      try {
        const response = await axios.get(
          "https://www.easyposdev.somee.com/Usuarios/GetAllRolUsuario"
        );
        console.log("API response:", response.data.usuarios);
        setRoles(response.data.usuarios);
      } catch (error) {
        console.log(error);
      }
    }

    fetchRoles();
  }, []);

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
    setSelectedRol("");
    setCodigoPostal("");
    setRut("");
    setCodigoUsuario("");
    setClave("");
    setRemuneracion("");
    setCredito("");
    // Clear errors
    setErrors({});
    setIsEditing(false);
    setUserId(null);
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
      errors.apellidos = "Favor completar apellidos ";
    }
    if (!correo) {
      errors.correo = "Favor completar email ";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
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
    console.log("Selected Region:", selectedRegion,"Selected Comuna:",selectedComuna);

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
        rol: selectedRol,
      };
      console.log(usuario);

      try {
        if (isEditing) {
          // Update user if in edit mode
          await axios.put(
            `https://www.easyposdev.somee.com/Usuarios/UpdateUsuario/${userId}`,
            usuario
          );
        } else {
          // Add new user if not in edit mode
          const response = await axios.post(
            "https://www.easyposdev.somee.com/Usuarios/AddUsuario",
            usuario
          );
          console.log(response.data, "DATA OK");
          setModalContent({
            description: response.data.descripcion,
            positive: true,
            message: "Usuario creado con éxito!",
          });
          setModalOpen(true);
        }
      } catch (error) {
        console.log(error.response.data, "Leer Error");
        if (error.response.status === 409) {
          // Handle conflict error here
          // For example, you could set an error message to inform the user that the username or email already exists
        }
        setModalContent({
          description: error.response.data.descripcion,
          positive: false,
          message: "Usuario no creado, favor intentar otra vez ",
        });
        setModalOpen(true);
      }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "70vh", width: "100%" }}>
        <CssBaseline />
        <Grid
          item
          xs={12}
          sm={8}
          md={12}
          lg={12}
          component={Paper}
          elevation={6}
          square
        >
          <Box
            sx={{
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            Ingreso Usuarios
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                sx={{ marginRight: 2 }}
                id="rut"
                label="Rut"
                name="rut"
                autoComplete="rut"
                autoFocus
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                error={Boolean(errors.rut)}
                helperText={errors.rut}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {errors.rut ? null : (
                        <Tooltip title="Rut válido">
                          <CheckCircleIcon />
                        </Tooltip>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                id="nombres"
                label="Nombres"
                name="nombres"
                autoComplete="nombres"
                autoFocus
                value={nombres}
                onChange={(e) => setNombre(e.target.value)}
                error={Boolean(errors.nombres)}
                helperText={errors.nombres}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {errors.nombres ? null : (
                        <Tooltip title="Nombres válidos">
                          <CheckCircleIcon />
                        </Tooltip>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                sx={{ marginRight: 2 }}
                id="apellidos"
                label="Apellidos"
                name="apellidos"
                autoComplete="apellidos"
                autoFocus
                value={apellidos}
                onChange={(e) => setApellido(e.target.value)}
                error={Boolean(errors.apellidos)}
                helperText={errors.apellidos}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {errors.apellidos ? null : (
                        <Tooltip title="Apellidos válidos">
                          <CheckCircleIcon />
                        </Tooltip>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                sx={{ marginRight: 2 }}
                id="correo"
                label="Correo"
                name="correo"
                autoComplete="correo"
                autoFocus
                value={correo}
                onChange={handleEmailChange}
                error={Boolean(errors.correo)}
                helperText={errors.correo}
                // InputProps={{
                //   endAdornment: (
                //     <InputAdornment position="end">
                //       {errors.correo ? null : (
                //         <Tooltip title="Correo válido">
                //           <CheckCircleIcon />
                //         </Tooltip>
                //       )}
                //     </InputAdornment>
                //   ),
                // }}
                InputProps={{
                  endAdornment: isEmailValid ? (
                    <CheckCircleIcon style={{ color: "green" }} />
                  ) : null,
                  style: {
                    backgroundColor: errors.correo ? "lightcoral" : "white",
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                sx={{ marginRight: 2 }}
                id="direccion"
                label="Dirección"
                name="direccion"
                autoComplete="direccion"
                autoFocus
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                error={Boolean(errors.direccion)}
                helperText={errors.direccion}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {errors.direccion ? null : (
                        <Tooltip title="Dirección válida">
                          <CheckCircleIcon />
                        </Tooltip>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                sx={{ marginRight: 2 }}
                id="telefono"
                label="Teléfono"
                name="telefono"
                autoComplete="telefono"
                autoFocus
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                error={Boolean(errors.telefono)}
                helperText={errors.telefono}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {errors.telefono ? null : (
                        <Tooltip title="Teléfono válido">
                          <CheckCircleIcon />
                        </Tooltip>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                id="Rol"
                select
                label="Rol"
                value={selectedRol}
                onChange={(e) => setSelectedRol(e.target.value)}
                error={Boolean(errors.selectedRol)}
                helperText={errors.selectedRol}
                sx={{ marginTop: 2 }}
                fullWidth
              >
                {roles.map((rol) => (
                  <MenuItem key={rol.idRol} value={rol.rol}>
                    {rol.rol}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
               sx={{ marginTop: 2 }}
               fullWidth
                id="region"
                select
                label="Región"
                value={selectedRegion}
                onChange={(e) => {
                  const regionID = e.target.value; // Extract ID based on the selected name
                  setSelectedRegion(regionID);
                }}
                // Other attributes...
              >
                {regionOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.regionNombre}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                sx={{ marginTop: 2 }}
                id="comuna"
                select
                fullWidth
                label="Comuna"
                value={selectedComuna}
                onChange={(e) => setSelectedComuna(e.target.value)}
                error={Boolean(errors.comuna)}
                helperText={errors.comuna}
              >
                {comunaOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                margin="normal"
                required
                sx={{ marginRight: 2 }}
                id="codigoPostal"
                label="Código Postal"
                name="codigoPostal"
                autoComplete="codigoPostal"
                autoFocus
                value={codigoPostal}
                onChange={(e) => setCodigoPostal(e.target.value)}
                error={Boolean(errors.codigoPostal)}
                helperText={errors.codigoPostal}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {errors.codigoPostal ? null : (
                        <Tooltip title="Código Postal válido">
                          <CheckCircleIcon />
                        </Tooltip>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                sx={{ marginRight: 2 }}
                id="codigoUsuario"
                label="Código Usuario"
                name="codigoUsuario"
                autoComplete="codigoUsuario"
                autoFocus
                value={codigoUsuario}
                onChange={(e) => setCodigoUsuario(e.target.value)}
                error={Boolean(errors.codigoUsuario)}
                helperText={errors.codigoUsuario}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {errors.codigoUsuario ? null : (
                        <Tooltip title="Código Usuario válido">
                          <CheckCircleIcon />
                        </Tooltip>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                id="clave"
                label="Clave"
                name="clave"
                sx={{ marginRight: 2 }}
                autoComplete="clave"
                autoFocus
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                error={Boolean(errors.clave)}
                helperText={errors.clave}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {errors.clave ? null : (
                        <Tooltip title="Clave válida">
                          <CheckCircleIcon />
                        </Tooltip>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                id="remuneracion"
                label="Remuneración"
                name="remuneracion"
                autoComplete="remuneracion"
                autoFocus
                value={remuneracion}
                onChange={(e) => setRemuneracion(e.target.value)}
                error={Boolean(errors.remuneracion)}
                helperText={errors.remuneracion}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {errors.remuneracion ? null : (
                        <Tooltip title="Remuneración válida">
                          <CheckCircleIcon />
                        </Tooltip>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                id="credito"
                label="Crédito"
                name="credito"
                autoComplete="credito"
                autoFocus
                value={credito}
                onChange={(e) => setCredito(e.target.value)}
                error={Boolean(errors.credito)}
                helperText={errors.credito}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {errors.credito ? null : (
                        <Tooltip title="Crédito válido">
                          <CheckCircleIcon />
                        </Tooltip>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {isEditing ? "Actualizar" : "Registrar"}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Dialog
        open={modalOpen}
        onClose={closeModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {modalContent.message}
            {Object.keys(errors).map((key) => (
              <DialogContentText
                key={key}
                id={`alert-dialog-description-${key}`}
              >
                {errors[key]}
              </DialogContentText>
            ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Ok</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
