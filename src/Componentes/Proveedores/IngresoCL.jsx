import React, { useState, useEffect } from "react";
import axios from "axios";
import InputAdornment from "@mui/material/InputAdornment";

import Tooltip from "@mui/material/Tooltip";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Swal from "sweetalert2";
import { saveAs } from "file-saver";
import * as xlsx from "xlsx/xlsx.mjs";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  Grid,
  Paper,
  Box,
  TextField,
  IconButton,
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
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
const IngresoCL = ({ handleCloseModalCL }) => {
    const apiUrl = import.meta.env.VITE_URL_API2;
  const [razonSocial, setRazonSocial] = useState("");
  const [giro, setGiro] = useState("");
  const [email, setEmail] = useState("");

  const [comuna, setComuna] = useState("");
  const [region, setRegion] = useState("");
  const [sucursal, setSucursal] = useState("");
  const [pagina, setUlrPagina] = useState("");
  const [formaPago, setFormaPago] = useState("");

  const [rut, setRut] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");

  const [correo, setCorreo] = useState("");
  const [telefonoResponsable, setTelefonoResponsable] = useState("");
  const [errors, setErrors] = useState([]);
  const [response, setResponse] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const theme = createTheme();
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedComuna, setSelectedComuna] = useState("");
  const [camposVacios, setCamposVacios] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [regionOptions, setRegionOptions] = useState([]);
  const [comunaOptions, setComunaOptions] = useState([]);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // Reset loading to false on unmount
    return () => setLoading(false);
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = xlsx.read(data, { type: "array" });

      for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        if (jsonData.length > 0) {
          const firstDataRow = jsonData[0];
          setRazonSocial(firstDataRow.razonSocial || "");
          setGiro(firstDataRow.giro || "");
          setEmail(firstDataRow.email || "");
          setDireccion(firstDataRow.direccion || "");
          setTelefono(firstDataRow.telefono || "");
          setRegion(firstDataRow.region || "");
          setComuna(firstDataRow.comuna || "");
          setSucursal(firstDataRow.sucursal || "");
          setUlrPagina(firstDataRow.pagina || "");
          setFormaPago(firstDataRow.formaPago || "");
          setRut(firstDataRow.rut || "");
          setNombreResponsable(firstDataRow.nombreResponsable || "");
          setcorreoResponsable(firstDataRow.correoResponsable || "");
          setTelefonoResponsable(firstDataRow.telefonoResponsable || "");
        }
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleExportExcel = () => {
    const jsonData = [
      {
        razonSocial: razonSocial,
        giro: giro,
        email: email,
        direccion: direccion,
        telefono: telefono,
        comuna: comuna,
        region: region,
        sucursal: sucursal,
        pagina: pagina,
        formaPago: formaPago,
        rut: rut,
        nombreResponsable: nombreResponsable,
        correoResponsable: correoResponsable,
        telefonoResponsable: telefonoResponsable,
      },
    ];

    const worksheet = xlsx.utils.json_to_sheet(jsonData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = xlsx.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const excelBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(excelBlob, "exported_data.xlsx");
  };

  useEffect(() => {
    if (formSubmitted && response) {
      setShowModal(true);
    }
  }, [formSubmitted, response]);

  const handleCloseModal = () => {
    setShowModal(false);
    setFormSubmitted(false);
  };

  useEffect(() => {
    axios
      .get( `${import.meta.env.VITE_URL_API2}/RegionComuna/GetAllRegiones`)
      .then((response) => {
        setRegiones(response.data.regiones);
      })
      .catch((error) => {
        console.error("Error al obtener las regiones:", error);
      });
  }, []);

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
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    setErrors((prevErrors) => ({
      ...prevErrors,
      correo: !inputEmail
        ? "Favor completar email"
        : !validateEmail(inputEmail)
        ? "Formato de correo no es válido"
        : "",
    }));
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  const handleCloseFormulario = () => {
    handleCloseModalCL()
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
    setLoading(true);
    const errors = [];
    const validateUrl = (url) => {
      // Expresión regular para validar una URL sin prefijos
      const urlRegex =
        /^(([\w-]+\.)*[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;

      return urlRegex.test(url);
    };

    // Validaciones
    if (!rut) {
      errors.rut = "Favor completar rut ";
    } else if (!validarRutChileno(rut)) {
      errors.rut = "El RUT ingresado NO es válido.";
    }

    if (!nombre) {
      errors.nombre = "Favor completar nombre";
    }
    if (!apellido) {
      errors.apellido = "Favor completar apellido";
    }
    if (!email) {
      errors.email = "Favor completar email";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,8}$/.test(email)) {
      errors.email = "Formato de email no es válido";
    }
    if (!telefono) {
      errors.telefono = "Favor completar telefono";
    }
    if (!direccion) {
      errors.direccion = "Favor completar direccion";
    }

    if (!selectedRegion) {
      errors.region = "Favor completar region";
    }

    if (!selectedComuna) {
      errors.comuna = "Favor completar comuna";
    }

    if (!razonSocial) {
      errors.razonSocial = "Favor completar razon social";
    }
    if (!pagina) {
      errors.pagina = "Favor completar página web";
    } else if (!validateUrl(pagina)) {
      errors.pagina = "La URL ingresada NO es válida.";
    }

    if (!giro) {
      errors.giro = "Favor completar giro";
    }

    if (!formaPago) {
      errors.formaPago = "Favor completar forma de pago";
    }

    // Validación para campos vacíos
    if (
      Object.values({
        rut,
        nombre,
        apellido,
        razonSocial,
        giro,
        email,
        telefono,
        direccion,
        region,
        comuna,
        sucursal,
        pagina,
        formaPago,
      }).every((value) => !value)
    ) {
      setCamposVacios("Todos los campos están vacíos, Favor completar");
      setLoading(false);
      return;
    } else {
      setCamposVacios("");
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      setLoading(false);
      return;
    } else {
      const cliente = {
        razonSocial,
        nombre,
        apellido,
        giro,
        correo: email,
        sucursal,
        direccion,
        telefono,
        region: selectedRegion.toString(),
        comuna: selectedComuna,
        urlPagina: pagina,
        formaPago,
        rut,
        usaCuentaCoriente: 0,
      };
      console.log("Datos a enviar:", cliente); // Aquí se muestran los datos en la consola

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_URL_API2}Clientes/AddCliente`,
          // "https://www.easypos.somee.com/api/Clientes/AddCliente",
          cliente
        );
        setResponse(response.data);
        setFormSubmitted(true);
        setLoading(false);

        console.log("respuesta post", response);
        if (response.status === 200) {
          setSnackbarMessage(response.data.descripcion);
          setSnackbarOpen(true);
          setRazonSocial("");
          setGiro("");
          setEmail("");
          setDireccion("");
          setTelefono("");
          setSucursal("");
          setSelectedRegion("");
          setSelectedComuna("");
          setUlrPagina("");
          setFormaPago("");
          setRut("");
          setApellido("");
          setNombre("");

          setTimeout(() => {
            handleCloseModalCL(); ////Cierre Modal al finalizar
          }, 1700);
        }
      } catch (error) {
        console.error(error);
        setSnackbarMessage("Error al crear el cliente");
        setSnackbarOpen(true);
        setLoading(false);
      }
    }
  };

  const handleNumericKeyDown = (event) => {
    const key = event.key;
    const input = event.target.value;

    // Verifica si el carácter es un número, backspace o delete
    if (
      !/\d/.test(key) && // números
      key !== "Backspace" && // backspace
      key !== "Delete" // delete
    ) {
      event.preventDefault();
    }

    // Previene espacios iniciales y al final de la cadena
    if (key === " " && (input.length === 0 || input.endsWith(" "))) {
      event.preventDefault();
    }
  };

  const handleTextKeyDown = (event) => {
    const key = event.key;
    const input = event.target.value;

    // Verifica si el carácter es alfanumérico o uno de los caracteres permitidos
    if (
      !/^[a-zA-Z0-9]$/.test(key) && // letras y números
      key !== " " && // espacio
      key !== "Backspace" && // backspace
      key !== "Delete" // delete
    ) {
      event.preventDefault();
    }

    // Previene espacios iniciales y al final de la cadena
    if (key === " " && (input.length === 0 || input.endsWith(" "))) {
      event.preventDefault();
    }
  };
  const handleEmailKeyDown = (event) => {
    const charCode = event.which ? event.which : event.keyCode;

    // Prevenir espacios en cualquier parte del correo
    if (charCode === 32) {
      // 32 es el código de la tecla espacio
      event.preventDefault();
    }
  };
  const handleRUTKeyDown = (event) => {
    const key = event.key;
    const input = event.target.value;

    // Permitir números (0-9), guion (-), backspace y delete
    if (
      !isNaN(key) || // números
      key === "Backspace" || // backspace
      key === "Delete" || // delete
      (key === "-" && !input.includes("-")) // guion y no hay guion previamente
    ) {
      // Permitir la tecla
    } else {
      // Prevenir cualquier otra tecla
      event.preventDefault();
    }

    // Prevenir espacios iniciales y asegurar que el cursor no esté en la posición inicial
    if (
      key === " " &&
      (input.length === 0 || event.target.selectionStart === 0)
    ) {
      event.preventDefault();
    }
  };

  const handleTextOnlyKeyDown = (event) => {
    const key = event.key;
    const input = event.target.value;

    // Verifica si el carácter es una letra (mayúscula o minúscula), espacio, backspace o delete
    if (
      !/[a-zA-Z]/.test(key) && // letras mayúsculas y minúsculas
      key !== " " && // espacio
      key !== "Backspace" && // backspace
      key !== "Delete" // delete
    ) {
      event.preventDefault();
    }

    // Previene espacios iniciales y al final de la cadena
    if (key === " " && (input.length === 0 || input.endsWith(" "))) {
      event.preventDefault();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
          py: 3,
        }}
      >
        <Paper
          elevation={3}
          sx={{ p: 2, borderRadius: 2, maxWidth: 1200, width: "100%" }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <h2>Ingreso Clientes</h2>
              </Grid>
              <Grid item xs={12} md={12}>
                {/* {Object.keys(errors).length > 0 && (
          <div style={{ color: "red", marginBottom: "1%", marginTop: "1%" }}>
            <ul>{Object.values(errors).map((error, index) => <li key={index}>{error}</li>)}</ul>
          </div>
        )} */}

                {Object.keys(errors).length > 0 && (
                  <div
                    style={{
                      color: "red",
                      marginBottom: "1%",
                      marginTop: "1%",
                    }}
                  >
                    <ul>{Object.values(errors)[0]}</ul>
                  </div>
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                {" "}
                {camposVacios && (
                  <p style={{ color: "red" }}> {camposVacios}</p>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel sx={{ marginBottom: "2%" }}>
                  Ingresa rut sin puntos y con guión
                </InputLabel>
                <TextField
                  fullWidth
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
              <Grid item xs={12} sm={6}>
                <InputLabel sx={{ marginBottom: "2%" }}>
                  Ingresa Nombre
                </InputLabel>
                <TextField
                  label="Nombre"
                  fullWidth
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  // error={!!errors.razonSocial}
                  // helperText={errors.razonSocial}
                  onKeyDown={handleTextOnlyKeyDown}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel sx={{ marginBottom: "2%" }}>
                  Ingresa apellido
                </InputLabel>
                <TextField
                  label="Apellido"
                  fullWidth
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  // error={!!errors.giro}
                  // helperText={errors.giro}
                  onKeyDown={handleTextOnlyKeyDown}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel sx={{ marginBottom: "2%" }}>
                  Ingresa Email
                </InputLabel>
                <TextField
                  label="Email"
                  fullWidth
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onKeyDown={handleEmailKeyDown}
                  // helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel sx={{ marginBottom: "2%" }}>
                  Ingresa Teléfono
                </InputLabel>
                <TextField
                  fullWidth
                  id="telefono"
                  label="Teléfono"
                  name="telefono"
                  autoComplete="telefono"
                  autoFocus
                  value={telefono}
                  onKeyDown={handleNumericKeyDown}
                  onChange={(e) => setTelefono(e.target.value)}
                  inputProps={{
                    maxLength: 12,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel sx={{ marginBottom: "2%" }}>
                  Ingresa Dirección
                </InputLabel>
                <TextField
                  label="Dirección"
                  fullWidth
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  onKeyDown={handleTextKeyDown}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel sx={{ marginBottom: "2%" }}>
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
                <InputLabel sx={{ marginBottom: "2%" }}>
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
                <InputLabel sx={{ marginBottom: "2%", fontSize: "0.9rem" }}>
                  Ingresa Razón social
                </InputLabel>
                <TextField
                  label="Razón social"
                  fullWidth
                  value={razonSocial}
                  onChange={(e) => setRazonSocial(e.target.value)}
                  // error={!!errors.razonSocial}
                  // helperText={errors.razonSocial}
                  onKeyDown={handleTextKeyDown}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel sx={{ marginBottom: "2%" }}>
                  Ingresa Página Web
                </InputLabel>
                <TextField
                  label="Página Web"
                  fullWidth
                  value={pagina}
                  onChange={(e) => setUlrPagina(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel sx={{ marginBottom: "2%", fontSize: "0.9rem" }}>
                  Ingresa Giro
                </InputLabel>
                <TextField
                  label="Giro"
                  fullWidth
                  value={giro}
                  onChange={(e) => setGiro(e.target.value)}
                  // error={!!errors.giro}
                  // helperText={errors.giro}
                  onKeyDown={handleTextOnlyKeyDown}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel sx={{ marginBottom: "2%" }}>
                  Ingresa Forma de Pago
                </InputLabel>
                <TextField
                  label="Forma de Pago"
                  fullWidth
                  value={formaPago}
                  onChange={(e) => setFormaPago(e.target.value)}
                  // onKeyDown={handleTextKeyDown}
                  onKeyDown={handleTextOnlyKeyDown}
                />
              </Grid>

              <Grid item xs={12}
              sx={{display:"flex",
                    justifyContent:"space-between"
                   
              

                  }}>
                <Button
                  type="submit"
                  disabled={loading}
                  variant="contained"
                  color="secondary"
                >
                  {loading ? (
                    <>
                      Guardando... <CircularProgress size={24} />
                    </>
                  ) : (
                    "Guardar"
                  )}
                </Button>
                <Button color="primary" variant="contained" onClick={ handleCloseFormulario}>
                  Cerrar
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseSnackbar}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </Box>
    </ThemeProvider>
  );
};

export default IngresoCL;
