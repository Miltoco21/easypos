/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Snackbar,
  TextField,
} from "@mui/material";
import axios from "axios";

const EditUsuario = ({ selectedUser, open, handleCloseEditModal }) => {
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // console.log("selectedUser :", selectedUser);

  useEffect(() => {
    if (selectedUser) {
      setNombre(selectedUser.nombres || "");
      setApellido(selectedUser.apellidos || "");
      setCorreo(selectedUser.correo || "");
      setTelefono(selectedUser.telefono || "");
      setDireccion(selectedUser.direccion || "");
      setCodigoPostal(selectedUser.codigoPostal || "");
      setRut(selectedUser.rut || "");
      setCodigoUsuario(selectedUser.codigoUsuario || "");
      setClave(selectedUser.clave || "");
      setRemuneracion(selectedUser.remuneracion || "");
      setCredito(selectedUser.credito || "");
      setSelectedRegion(selectedUser.region || "");
      setSelectedComuna(selectedUser.comuna || "");
      setSelectedRol(selectedUser.rol || "");
    }
  }, [selectedUser]);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/RegionComuna/GetAllRegiones`
        );
        setRegionOptions(response.data.regiones);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRegions();
  }, [apiUrl]);

  useEffect(() => {
    const fetchComunas = async () => {
      if (selectedRegion) {
        try {
          const response = await axios.get(
            `${apiUrl}/RegionComuna/GetComunaByIDRegion?IdRegion=${selectedRegion}`
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
  }, [selectedRegion, apiUrl]);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const response = await axios.get(`${apiUrl}/Usuarios/GetAllRolUsuario`);
        setRolesOptions(response.data.usuarios);
      } catch (error) {
        console.log(error);
      }
    }
    fetchRoles();
  }, [apiUrl]);

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
    if (!selectedRol) {
      errors.selectedRol = "Favor completar rol";
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
      try {
        setLoading(true);
        const response = await axios.put(`${apiUrl}/Usuarios/UpdateUsuario`, {
          nombres,
          apellidos,
          correo,
          direccion,
          telefono,
          region: selectedRegion.toString(),
          comuna: selectedComuna,
          codigoPostal,
          rut,
          codigoUsuario: selectedUser.codigoUsuario,
          clave,
          rol: selectedRol.toString(),
          remuneracion,
          credito,
        });
        if (response.status === 200) {
          setNombre("");
          setApellido("");
          setCorreo("");
          setTelefono("");
          setDireccion("");
          setCodigoPostal("");
          setRut("");
          setCodigoUsuario("");
          setClave("");
          setRemuneracion("");
          setCredito("");
          setSelectedRegion("");
          setSelectedComuna("");
          setSelectedRol("");
          setSnackbarMessage(response.data.descripcion);
          setSnackbarOpen(true);
          setTimeout(() => {
            handleCloseEditModal();
          }, 3000);
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          setSnackbarMessage(error.response.data.descripcion);
          setSnackbarOpen(true);
        } else {
          console.error("Error:", error);
          setModalOpen(true);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleCloseEditModal}>
      <DialogTitle>Editar Usuario</DialogTitle>
      <DialogContent sx={{ width: "600px" }}>
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Nombres"
              value={nombres}
              onChange={(e) => setNombre(e.target.value)}
              error={Boolean(errores.nombres)}
              helperText={errores.nombres}
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Apellidos"
              value={apellidos}
              onChange={(e) => setApellido(e.target.value)}
              error={Boolean(errores.apellidos)}
              helperText={errores.apellidos}
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Correo"
              value={correo}
              onChange={handleEmailChange}
              error={Boolean(errores.correo)}
              helperText={errores.correo}
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              error={Boolean(errores.telefono)}
              helperText={errores.telefono}
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Dirección"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              error={Boolean(errores.direccion)}
              helperText={errores.direccion}
            />
          </Box>
          <Box mb={2}>
            <InputLabel>Región</InputLabel>
            <TextField
              fullWidth
              select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              error={Boolean(errores.selectedRegion)}
              helperText={errores.selectedRegion}
            >
              {regionOptions.map((region) => (
                <MenuItem key={region.id} value={region.id}>
                  {region.regionNombre}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box mb={2}>
            <InputLabel>Comuna</InputLabel>
            <TextField
              fullWidth
              select
              value={selectedComuna}
              onChange={(e) => setSelectedComuna(e.target.value)}
              error={Boolean(errores.comuna)}
              helperText={errores.comuna}
            >
              {comunaOptions.map((comuna) => (
                <MenuItem key={comuna} value={comuna}>
                  {comuna}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Código Postal"
              value={codigoPostal}
              onChange={(e) => setCodigoPostal(e.target.value)}
              error={Boolean(errores.codigoPostal)}
              helperText={errores.codigoPostal}
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="RUT"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              error={Boolean(errores.rut)}
              helperText={errores.rut}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Rol"
              value={selectedRol}
              onChange={(e) => {
                console.log("Roles Options:", rolesOptions);
                console.log("Selected Rol:", e.target.value);
                const selectedRolObj = rolesOptions.find(
                  (rol) => rol.rol === e.target.value
                );
                console.log("Selected Rol Object:", selectedRolObj);
                if (selectedRolObj) {
                  setSelectedRol(selectedRolObj.rol);
                }
              }}
              error={!!errores.selectedRol}
              helperText={errores.selectedRol}
              fullWidth
              margin="normal"
              select
            >
              {rolesOptions.map((rol) => (
                <MenuItem key={rol.idRol} value={rol.rol}>
                  {rol.rol}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Código Usuario"
              value={codigoUsuario}
              onChange={(e) => setCodigoUsuario(e.target.value)}
              error={Boolean(errores.codigoUsuario)}
              helperText={errores.codigoUsuario}
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Clave"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              error={Boolean(errores.clave)}
              helperText={errores.clave}
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Remuneración"
              value={remuneracion}
              onChange={(e) => setRemuneracion(e.target.value)}
              error={Boolean(errores.remuneracion)}
              helperText={errores.remuneracion}
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Crédito"
              value={credito}
              onChange={(e) => setCredito(e.target.value)}
              error={Boolean(errores.credito)}
              helperText={errores.credito}
            />
          </Box>
          <DialogActions>
            <Button onClick={handleCloseEditModal}>Cancelar</Button>
            <Button
              type="submit"
              disabled={loading}
              variant="contained"
              color="primary"
            >
              {loading ? <CircularProgress size={24} /> : "Guardar"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Dialog>
  );
};

export default EditUsuario;
