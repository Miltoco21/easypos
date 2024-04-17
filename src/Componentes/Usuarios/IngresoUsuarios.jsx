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
} from "@mui/material";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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
  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState({});
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
          "https://www.easyposdev.somee.com/Usuarios/GetAllRolUsuario"
        );
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
    if (!validarRutChileno(rut)) {
      errors.rut = "El RUT ingresado NO es válido.";
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
      setErrores(errors);
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
          setModalContent({
            description: response.data.descripcion,
            positive: true,
            message: "Usuario creado con éxito!",
          });
          setModalOpen(true);
        }
      } catch (error) {
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

  return (
    <>
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
            {/* {Object.keys(errores).length > 0 && (
    <div style={{ color: "red", marginBottom: "1rem" }}>
      Por favor, corrija los siguientes errores antes de continuar:
      <ul>
        {Object.values(errores).map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  )} */}
            <h2>Ingreso Usuarios</h2>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              {Object.keys(errores).length > 0 && (
                <div
                  style={{ color: "red", marginBottom: "1%", marginTop: "1%" }}
                >
                  <ul>{Object.values(errores)[0]}</ul>
                </div>
              )}

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <InputLabel sx={{ marginBottom: "4%" }}>
                    Ingresa rut sin puntos y con guión
                  </InputLabel>
                  <TextField
                    fullWidth
                    margin="normal"
                    required
                    sx={{ marginRight: 2 }}
                    id="rut"
                    label="ej: 11111111-1"
                    name="rut"
                    autoComplete="rut"
                    autoFocus
                    value={rut}
                    onChange={(e) => setRut(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                <InputLabel sx={{ marginBottom: "4%" }}>
                    Ingresa Nombre
                  </InputLabel>
                  <TextField
                    fullWidth
                    margin="normal"
                    required
                    id="nombres"
                    label="Nombres"
                    name="nombres"
                    autoComplete="nombres"
                    autoFocus
                    value={nombres}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                <InputLabel sx={{ marginBottom: "4%" }}>
                    Ingresa Apellidos
                  </InputLabel>
                  <TextField
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
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                <InputLabel sx={{ marginBottom: "4%" }}>
                    Ingresa Correo Electrónico
                  </InputLabel>
                  <TextField
                    fullWidth
                    margin="normal"
                    required
                    id="correo"
                    label="Correo Electrónico"
                    name="correo"
                    autoComplete="correo"
                    autoFocus
                    value={correo}
                    onChange={handleEmailChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                <InputLabel sx={{ marginBottom: "4%" }}>
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
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                <InputLabel sx={{ marginBottom: "4%" }}>
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
                <Grid item xs={12} sm={6}>
                  <InputLabel sx={{ marginBottom: "4%" }}>
                    Selecciona Región
                  </InputLabel>
                  <TextField
                    fullWidth
                    id="region"
                    select
                    label="Región"
                    value={selectedRegion}
                    onChange={(e) => {
                  
                      setSelectedRegion(e.target.value);
                      // Actualizar el valor en formData
                      
                    }}
                  >
                    {regionOptions.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.regionNombre}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputLabel sx={{ marginBottom: "4%" }}>
                    Selecciona Comuna
                  </InputLabel>
                  <TextField
                    id="comuna"
                    select
                    fullWidth
                    label="Comuna"
                    value={selectedComuna}
                    onChange={(e) => {
                      const comunaValue = e.target.value;
                      setSelectedComuna(e.target.value);
                      // Actualizar el valor en formData.comuna (sin sucursal)
                      
                    }}
                  >
                    {comunaOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                <InputLabel sx={{ marginBottom: "4%" }}>
                    Ingresa Código Postal
                  </InputLabel>
                  <TextField
                    fullWidth
                    margin="normal"
                    required
                    id="codigoPostal"
                    label="Código Postal"
                    name="codigoPostal"
                    autoComplete="codigoPostal"
                    autoFocus
                    value={codigoPostal}
                    onChange={(e) => setCodigoPostal(e.target.value)}
                  />
                </Grid>
              
                <Grid item xs={12} sm={6}>
                <InputLabel sx={{ marginBottom: "4%" }}>
                    Ingresa Clave
                  </InputLabel>
                  <TextField
                    fullWidth
                    margin="normal"
                    required
                    id="clave"
                    label="Clave"
                    name="clave"
                    type="password"
                    autoComplete="new-password"
                    autoFocus
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                <InputLabel sx={{ marginBottom: "4%" }}>
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
                  >
                    <MenuItem value="Diario">Diario</MenuItem>
                    <MenuItem value="Semanal">Semanal</MenuItem>
                    <MenuItem value="Mensual">Mensual</MenuItem>
                    {/* Agrega más opciones según sea necesario */}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                <InputLabel sx={{ marginBottom: "4%" }}>
                    Ingresa Crédito
                  </InputLabel>
                  <TextField
                    fullWidth
                    margin="normal"
                    required
                    id="credito"
                    label="Crédito"
                    name="credito"
                    autoComplete="credito"
                    autoFocus
                    value={credito}
                    onChange={(e) => setCredito(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                onSubmit={handleSubmit}
                variant="contained"
                disabled={loading}
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
        <DialogContent>{modalContent.message}</DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Ok</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
