/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";

import {
  Grid,
  Paper,
  Box,
  TextField,
  Button,
  CircularProgress,
  MenuItem,
  InputLabel,
  CssBaseline,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  IconButton,
  InputAdornment 
} from "@mui/material";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


export const defaultTheme = createTheme();

export default function IngresoUsuarios({ onClose}) {

  const apiUrl = import.meta.env.VITE_URL_API2;

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
  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedComuna, setSelectedComuna] = useState("");
  const [regionOptions, setRegionOptions] = useState([]);
  const [comunaOptions, setComunaOptions] = useState([]);
  const [rolesOptions, setRolesOptions] = useState([]);
  const [selectedRol, setSelectedRol] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);


  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL_API2}/RegionComuna/GetAllRegiones`
        );
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
            `${import.meta.env.VITE_URL_API2}/RegionComuna/GetComunaByIDRegion?IdRegion=${selectedRegion}`
          );
          console.log("comunas:",response.data.comunas)
          setComunaOptions(
            response.data.comunas.map((comuna) => comuna.comunaNombre)
          );
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
          `${import.meta.env.VITE_URL_API2}/Usuarios/GetAllRolUsuario`
        );
        setRolesOptions(response.data.usuarios);
        console.log("ROLES", response.data.usuarios);
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
    setErrores((prevErrores) => ({
      ...prevErrores,
      correo: !inputEmail
        ? "Favor completar email"
        : !validateEmail(inputEmail)
        ? "Formato de correo no es válido"
        : "",
    }));
  };

  const validarRutChileno = (rut) => {
    if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rut)) {
      return false;
    }

    const partesRut = rut.split("-");
    const digitoVerificador = partesRut[1].toUpperCase();
    const numeroRut = partesRut[0];
    if (numeroRut.length < 7) {
      return false;
    }

    const calcularDigitoVerificador = (T) => {
      let M = 0;
      let S = 1;
      for (; T; T = Math.floor(T / 10)) {
        S = (S + (T % 10) * (9 - (M++ % 6))) % 11;
      }
      return S ? String(S - 1) : "K";
    };

    return calcularDigitoVerificador(numeroRut) === digitoVerificador;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = {};
  
    // Validaciones
    if (!rut) {
      errors.rut = "Favor completar RUT.";
    } else if (!validarRutChileno(rut)) {
      errors.rut = "El RUT ingresado no es válido.";
    }
  
    if (!nombres) errors.nombres = "Favor completar nombres.";
    if (!apellidos) errors.apellidos = "Favor completar apellidos.";
    if (!correo) {
      errors.correo = "Favor completar correo electrónico.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      errors.correo = "Formato de correo no es válido.";
    }
    if (!telefono) errors.telefono = "Favor completar teléfono.";
    if (!codigoUsuario) errors.codigoUsuario = "Favor completar código de usuario.";
    if (!direccion) errors.direccion = "Favor completar dirección.";
    if (!selectedComuna || selectedComuna.length === 0) errors.comuna = "Favor completar comuna.";
    if (!selectedRegion) errors.selectedRegion = "Favor completar región.";
    if (!codigoPostal) errors.codigoPostal = "Favor completar código postal.";
    if (!selectedRol) errors.selectedRol = "Favor completar rol.";
    if (!clave) errors.clave = "Favor completar clave.";
    if (!remuneracion) errors.remuneracion = "Favor completar remuneración.";
    if (!credito) errors.credito = "Favor completar crédito.";
  
    if (Object.keys(errors).length > 0) {
      setErrores(errors);
      return;
    }
  
    const usuario = {
      nombres,
      apellidos,
      correo,
      direccion,
      telefono,
      region: selectedRegion.toString(),
      comuna: selectedComuna,
      codigoPostal,
      rut,
      codigoUsuario,
      clave,
      rol: selectedRol.toString(),
      // remuneracion,
      // credito,
    };
  
    console.log("Datos antes de enviar:", usuario);
  
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_URL_API2}/Usuarios/AddUsuario`,
        usuario
      );
      console.log("Respuesta de la solicitud:", response);
  
      if (response.status === 201) {
        setSnackbarMessage("Usuario creado exitosamente");
        setSnackbarOpen(true);
        resetForm(); // Reset form after successful submission
      }
    } catch (error) {
      console.error("Error:", error);
  
      if (error.response?.status === 409) {
        setSnackbarMessage(error.response.data?.descripcion || "Usuario ya existe.");
      } else {
        setSnackbarMessage("Error al crear el usuario.");
        setModalOpen(true);
      }
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
      console.log("Datos después de enviar:", usuario);
    }
  };
  
  const resetForm = () => {
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
    setErrores({});
    setUserId(null);
  
    setTimeout(() => {
      onClose();
    }, 3000);
  };
  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   const errors = [];

  //   //Validaciones
  //   if (!rut) {
  //     errors.rut = "Favor completar rut ";
  //   } else if (!validarRutChileno(rut)) {
  //     errors.rut = "El RUT ingresado NO es válido.";
  //   }

  //   if (!nombres) {
  //     errors.nombres = "Favor completar nombres ";
  //   }
  //   if (!apellidos) {
  //     errors.apellidos = "Favor completar apellidos ";
  //   }
  //   if (!correo) {
  //     errors.correo = "Favor completar email ";
  //   } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
  //     errors.correo = "Formato de correo no es válido";
  //   }
   
  //   if (!telefono) {
  //     errors.telefono = "Favor completar telefono ";
  //   } 
  //   if (!codigoUsuario) {
  //     errors.codigoUsuario = "Favor completar código de Usuario ";
  //   } 
  //   if (!direccion) {
  //     errors.direccion = "Favor completar dirección ";
  //   }
  //   if (!selectedComuna || selectedComuna.length === 0) {
  //     errors.comuna = "Favor completar comuna ";
  //   }
  //   if (!selectedRegion) {
  //     errors.selectedRegion = "Favor completar región ";
  //   }
  //   if (!codigoPostal) {
  //     errors.codigoPostal = "Favor completar codigo postal ";
  //   }
  //   if (!rut) {
  //     errors.rut = "Favor completar rut ";
  //   }
  //   if (!validarRutChileno(rut)) {
  //     errors.rut = "El RUT ingresado NO es válido.";
  //   }
  //   if (!selectedRol) {
  //     errors.selectedRol = "Favor completar rol";
  //   }
  //   if (!codigoUsuario) {
  //     errors.codigoUsuario = "Favor completar código usuario ";
  //   }
  //   if (!clave) {
  //     errors.clave = "Favor completar clave ";
  //   }
  //   if (!remuneracion) {
  //     errors.remuneracion = "Favor completar remuneración ";
  //   }
  //   if (!credito) {
  //     errors.credito = "Favor completar crédito ";
  //   }

  //   if (Object.keys(errors).length > 0) {
  //     setErrores(errors);
  //   } else {
  //     const usuario = {
  //       nombres: nombres,
  //       apellidos: apellidos,
  //       correo: correo,
  //       direccion: direccion,
  //       telefono: telefono,
  //       region: selectedRegion.toString(),
  //       comuna: selectedComuna,
  //       codigoPostal: codigoPostal,
  //       rut: rut,
    
  //       codigoUsuario: codigoUsuario,
  //       clave: clave,
  //       // remuneracion: remuneracion,
  //       // credito: credito,
  //       rol: selectedRol.toString(),
  //     };
  //     console.log("Datos antes de enviar:", usuario);
  //     try {
  //       setLoading(true);
  //       const response = await axios.post(
          
  //         `${import.meta.env.VITE_URL_API2}/Usuarios/AddUsuario`,
  //         usuario
  //       );
  //       console.log("Respuesta de la solicitud:", response);

  //       if (response.status === 201) {
  //         setSnackbarMessage("Usuario creado exitosamente");
  //         setSnackbarOpen(true);
  //       }
  //     } catch (error) {
  //       if ( error.response.status === 409) {
  //         setSnackbarMessage(error.response.descripcion);
  //         setSnackbarOpen(true);
  //       } else {
  //         console.error("Error:", error);
  //         setModalOpen(true);
  //       }
  //     } finally {
  //       setLoading(false);
  //       console.log("Datos después de enviar:", usuario);
  //       setNombre("");
  //       setApellido("");
  //       setCorreo("");
  //       setTelefono("");
  //       setDireccion("");
  //       setSelectedRegion("");
  //       setSelectedComuna("");
  //       setSelectedRol("");
  //       setCodigoPostal("");
  //       setRut("");
  //       setCodigoUsuario("");
  //       setClave("");
  //       setRemuneracion("");
  //       setCredito("");
  //       setErrores({});
       
  //       setUserId(null);

  //       setTimeout(() => {
  //         onClose();
  //       }, 3000);
       
  //     }
  //   }
  // };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

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
    setErrores({});
    setIsEditing(false);
    setUserId(null);
  };

  const handleNumericKeyDown = (event) => {
    const key = event.key;
    const input = event.target.value;
  
    // Verifica si el carácter es un número, backspace o delete
    if (
    !/\d/.test(key) && // números
      key!== 'Backspace' && // backspace
      key!== 'Delete' // delete
    ) {
      event.preventDefault();
    }
  
    // Previene espacios iniciales y al final de la cadena
    if (
      key === ' ' &&
      (input.length === 0 || input.endsWith(' '))
    ) {
      event.preventDefault();
    }
  };
  
  const handleTextKeyDown = (event) => {
    const key = event.key;
    const input = event.target.value;
  
    // Verifica si el carácter es alfanumérico o uno de los caracteres permitidos
    if (
     !/^[a-zA-Z0-9]$/.test(key) && // letras y números
      key!== ' ' && // espacio
      key!== 'Backspace' && // backspace
      key!== 'Delete' // delete
    ) {
      event.preventDefault();
    }
  
    // Previene espacios iniciales y al final de la cadena
    if (
      key === ' ' &&
      (input.length === 0 || input.endsWith(' '))
    ) {
      event.preventDefault();
    }
  };
  const handleEmailKeyDown = (event) => {
    const charCode = event.which ? event.which : event.keyCode;
  
    // Prevenir espacios en cualquier parte del correo
    if (charCode === 32) { // 32 es el código de la tecla espacio
      event.preventDefault();
    }
  };
  const handleRUTKeyDown = (event) => {
    const key = event.key;
    const input = event.target.value;
  
    // Permitir números (0-9), guion (-), backspace y delete
    if (
     !isNaN(key) || // números
      key === 'Backspace' || // backspace
      key === 'Delete' || // delete
      (key === '-' && !input.includes('-')) // guion y no hay guion previamente
    ) {
      // Permitir la tecla
    } else {
      // Prevenir cualquier otra tecla
      event.preventDefault();
    }
  
    // Prevenir espacios iniciales y asegurar que el cursor no esté en la posición inicial
    if (key === ' ' && (input.length === 0 || event.target.selectionStart === 0)) {
      event.preventDefault();
    }
  };

  const handleTextOnlyKeyDown = (event) => {
    const key = event.key;
    const input = event.target.value;
  
    // Verifica si el carácter es una letra (mayúscula o minúscula), espacio, backspace o delete
    if (
     !/[a-zA-Z]/.test(key) && // letras mayúsculas y minúsculas
      key!== ' ' && // espacio
      key!== 'Backspace' && // backspace
      key!== 'Delete' // delete
    ) {
      event.preventDefault();
    }
  
    // Previene espacios iniciales y al final de la cadena
    if (
      key === ' ' &&
      (input.length === 0 || input.endsWith(' '))
    ) {
      event.preventDefault();
    }
  };
  return (
    <div style={{ overflow: "auto" }}>
      <Grid item xs={12} container>
        <Paper elevation={16} square>
          <Grid container spacing={2} sx={{ padding: "2%" }}>
            <Grid item xs={12}>
              <h2>Ingreso Usuarios</h2>
            </Grid>
            <Grid item xs={12} md={12}>
              {Object.keys(errores).length > 0 && (
                <div
                  style={{ color: "red", marginBottom: "1%", marginTop: "1%" }}
                >
                  <ul>{Object.values(errores)[0]}</ul>
                </div>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <InputLabel sx={{ marginBottom: "2%", }}>
                Ingresa rut sin puntos y con guión
              </InputLabel>
              <TextField
                fullWidth
                margin="normal"
                required
                id="rut"
                label="ej: 11111111-1"
                name="rut"
                autoComplete="rut"
                autoFocus
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                onKeyDown={handleRUTKeyDown}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputLabel sx={{ marginBottom: "2%" }}>
                Ingresa Nombre
              </InputLabel>
              <TextField
                fullWidth
                margin="normal"
                required
                type="text"
                id="nombres"
                label="Nombres"
                name="nombres"
                autoComplete="nombres"
                autoFocus
                value={nombres}
                onChange={(e) => setNombre(e.target.value)}
                onKeyDown={handleTextOnlyKeyDown}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputLabel sx={{ marginBottom: "2%" }}>
                Ingresa Apellidos
              </InputLabel>
              <TextField
                type="text"
                fullWidth
                margin="normal"
                required
                id="apellidos"
                label="Apellidos"
                name="apellidos"
                autoComplete="apellidos"
                autoFocus
                value={apellidos}
                onChange={(e) => setApellido(e.target.value)}
                onKeyDown={handleTextOnlyKeyDown}

              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputLabel sx={{ marginBottom: "2%" }}>
                Ingresa Correo Electrónico
              </InputLabel>
              <TextField
                fullWidth
                margin="normal"
                required
                type="email"
                id="correo"
                label="Correo Electrónico"
                name="correo"
                autoComplete="correo"
                autoFocus
                value={correo}
                onChange={handleEmailChange}
                onKeyDown={handleEmailKeyDown}

              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputLabel sx={{ marginBottom: "2%" }}>
                Ingresa Teléfono
              </InputLabel>
              <TextField
                fullWidth
            
                margin="normal"
                required
                id="telefono"
                label="Teléfono"
                name="telefono"
                autoComplete="telefono"
                autoFocus
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                onKeyDown={handleNumericKeyDown}
                   inputProps={{
                    maxLength: 12,
                  }}

              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputLabel sx={{ marginBottom: "2%" }}>
                Ingresa Código Usuario
              </InputLabel>
              <TextField
                fullWidth
             
                margin="normal"
                required
                id="Código Cliente"
                label="Ingrese valor numérico"
                name="Código Cliente"
                autoComplete="Código Cliente"
                autoFocus
                value={codigoUsuario}
                onChange={(e) => setCodigoUsuario(e.target.value)}
                onKeyDown={handleNumericKeyDown}


                
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputLabel sx={{ marginBottom: "2%" }}>
                Ingresa Dirección
              </InputLabel>
              <TextField
                fullWidth
                margin="normal"
                required
                id="direccion"
                label="Dirección"
                name="direccion"
                autoComplete="direccion"
                autoFocus
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputLabel sx={{ marginBottom: "2%" }}>
                Selecciona Región
              </InputLabel>
              <TextField
                margin="normal"
                required
                fullWidth
                id="region"
                select
                label="Región"
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value);
                }}
              >
                {regionOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.regionNombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <InputLabel sx={{ marginBottom: "2%" }}>
                Selecciona Comuna
              </InputLabel>
              <TextField
                margin="normal"
                required
                id="comuna"
                select
                fullWidth
                label="Comuna"
                value={selectedComuna}
                onChange={(e) => {
                  const comunaValue = e.target.value;
                  setSelectedComuna(e.target.value);
                }}
              >
                {comunaOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <InputLabel sx={{ marginBottom: "2%" }}>
                Selecciona Rol
              </InputLabel>
              <TextField
                fullWidth
                margin="normal"
                required
                id="rol"
                select
                label="Rol"
                name="rol"
                value={selectedRol}
                onChange={(e) => setSelectedRol(e.target.value)}
              >
                {rolesOptions.map((rol) => (
                  <MenuItem key={rol.idRol} value={rol.rol}>
                    {rol.rol}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <InputLabel sx={{ marginBottom: "2%" }}>
                Ingresa Código Postal
              </InputLabel>
              <TextField
                fullWidth
                margin="normal"
                required
              
                id="codigoPostal"
                label="Ingrese valor numérico"
                name="codigoPostal"
                autoComplete="codigoPostal"
                autoFocus
                value={codigoPostal}
                onChange={(e) => setCodigoPostal(e.target.value)}
                onKeyDown={handleNumericKeyDown}

              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputLabel sx={{ marginBottom: "2%" }}>Ingresa Clave</InputLabel>
              <TextField
      fullWidth
      margin="normal"
     
      id="clave"
      label="Ingrese valor alfanumérico"
      name="clave"
      type={showPassword ? 'text' : 'password'}
      autoComplete="new-password"
      autoFocus
      value={clave}
      onChange={(e) => setClave(e.target.value)}
      onKeyDown={handleTextKeyDown}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff fontSize="small"  /> : <Visibility fontSize="small"  />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputLabel sx={{ marginBottom: "2%" }}>
                Ingresa Remuneración
              </InputLabel>
              <TextField
                fullWidth
                margin="normal"
                required
                id="remuneracion"
                select
                label="Remuneración"
                name="remuneracion"
                autoComplete="remuneracion"
                autoFocus
                value={remuneracion}
                onChange={(e) => setRemuneracion(e.target.value)}
                onKeyDown={handleTextOnlyKeyDown}

              >
                <MenuItem value="Diario">Diario</MenuItem>
                <MenuItem value="Semanal">Semanal</MenuItem>
                <MenuItem value="Mensual">Mensual</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <InputLabel sx={{ marginBottom: "2%" }}>
                Ingresa Crédito
              </InputLabel>
              <TextField
                fullWidth
                margin="normal"
                required
                id="credito"
                label="Ingrese valor numérico"
                
                name="credito"
                autoComplete="credito"
                autoFocus
                value={credito}
                onChange={(e) => setCredito(e.target.value)}
                onKeyDown={handleNumericKeyDown}

              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              onClick={handleSubmit}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} /> Procesando...
                </>
              ) : (
                "Registrar usuario"
              )}
            </Button>
          </Grid>
        </Paper>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </div>
  );
}
