/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useState, useEffect } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Tooltip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Swal from "sweetalert2";
import { saveAs } from "file-saver";
import * as xlsx from "xlsx/xlsx.mjs";
import withReactContent from "sweetalert2-react-content";
import UploadFileIcon from "@mui/icons-material/UploadFile";

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
  const [pagina, setUlrPagina] = useState("");
  const [formaPago, setFormaPago] = useState("");
  const [nombreResponsable, setNombreResponsable] = useState("");
  const [correoResponsable, setcorreoResponsable] = useState("");
  const [telefonoResponsable, setTelefonoResponsable] = useState("");
  const [errors, setErrors] = useState({}); //error como objetos
  const [showAlert, setShowAlert] = useState(false);
  const [response, setResponse] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const MySwal = withReactContent(Swal);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = xlsx.read(data, { type: "array" });

      for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        // Archivo Excel debe tener headers = 'razonSocial', 'giro', 'email', etc.

        if (jsonData.length > 0) {
          const firstDataRow = jsonData[0];
          setRazonSocial(firstDataRow.razonSocial || "");
          setGiro(firstDataRow.giro || "");
          setEmail(firstDataRow.email || "");
          setDireccion(firstDataRow.direccion || "");
          setTelefono(firstDataRow.telefono || "");
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

  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  useEffect(() => {
    if (showAlert && response) {
      MySwal.fire({
        title: <p>Guardado con éxito</p>,
        icon: "success",
        onClose: handleCloseAlert, // Close the alert when the user clicks outside or presses Esc
      });
    }
  }, [showAlert, response]);

  const displaySuccessAlert = () => {
    MySwal.fire({
      title: <p>Guardado con éxito</p>,
      icon: "success",
      onClose: handleCloseAlert,
    });
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

    if (!razonSocial) {
      errors.razonSocial = "Favor completar campo ";
    }
    if (!sucursal) {
      errors.sucursal = "Favor completar campo ";
    }
    if (!email) {
      errors.email = "Favor completar campo ";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,8}$/.test(email)) {
      errors.email = "Formato de email no es válido";
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
    if (!pagina) {
      errors.pagina = "Favor completar campo ";
    }
    if (!rut) {
      errors.rut = "Favor completar campo ";
    }
    if (!formaPago) {
      errors.formaPago = "Favor completar campo ";
    }
    if (!nombreResponsable) {
      errors.nombreResponsable = "Favor completar campo ";
    }
    if (!correoResponsable) {
      errors.correoResponsable = "Favor completar campo ";
    }
    if (!sucursal) {
      errors.sucursal = "Favor completar campo ";
    }
    if (!telefonoResponsable) {
      errors.telefonoResponsable = "Favor completar campo ";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    } else {
      const cliente = {
        razonSocial,
        giro,
        email,
        sucursal,
        direccion,
        telefono,
        comuna,
        pagina,
        formaPago,
        rut,
        nombreResponsable,
        correoResponsable,
        telefonoResponsable,
      };
      console.log(cliente);

      try {
        const response = await axios.post(
          "https://www.easyposdev.somee.com/api/Proveedores/AddProveedor",
          cliente
        );
        setResponse(response.data);
        setFormSubmitted(true);
        console.log(response, "debugMiltoco");

        setShowAlert(true);

        setRazonSocial("");
        setGiro("");
        setEmail("");
        setDireccion("");
        setTelefono("");
        setSucursal("");
        setComuna("");
        setUlrPagina("");
        setFormaPago("");
        setRut("");
        setNombreResponsable("");
        setcorreoResponsable("");
        setTelefonoResponsable("");
      } catch (error) {
        console.log(error.response.data, "Leer Error");
        Swal.fire({
          position: "top-end",
          icon: "error",
          text: error.response.data.descripcion,
          title: error.response.data.title,
        });
      }
    }
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh", width: "90vw" }}>
        <CssBaseline />

        <Grid
          item
          xs={12}
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
                    autoComplete="razonsocial"
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
                          /^[\w-.]+@([\w-]+\.)+[\w-]{2,8}$/.test(email) ? (
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
                    error={!!errors.sucursal}
                    helperText={errors.sucursal}
                    required
                    fullWidth
                    name="sucursal"
                    label="Sucursal"
                    type="text"
                    id="sucursal"
                    value={sucursal}
                    onChange={(e) => setSucursal(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    error={!!errors.pagina}
                    helperText={errors.pagina}
                    required
                    fullWidth
                    name="pagina"
                    label="Página"
                    type="text"
                    id="pagina"
                    value={pagina}
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
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    required
                    fullWidth
                    error={!!errors.nombreResponsable}
                    helperText={errors.nombreResponsable}
                    name="nombreResponsable"
                    label="Nombre Responsable"
                    type="text"
                    id="nombreResponsable"
                    value={nombreResponsable}
                    onChange={(e) => setNombreResponsable(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    required
                    fullWidth
                    error={!!errors.correoResponsable}
                    helperText={errors.correoResponsable}
                    name="correoResponsable"
                    label="Correo Responsable"
                    type="text"
                    id="correoResponsable"
                    value={correoResponsable}
                    onChange={(e) => setcorreoResponsable(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    required
                    fullWidth
                    error={!!errors.telefonoResponsable}
                    helperText={errors.telefonoResponsable}
                    name="telefonoResponsable"
                    label="Telefono Responsable"
                    type="text"
                    id="telefonoResponsable"
                    value={telefonoResponsable}
                    onChange={(e) => setTelefonoResponsable(e.target.value)}
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
              </Button>{" "}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={5}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="md"
                    onClick={handleExportExcel}
                  >
                    Exportar a Excel
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={5}>
                  <Box sx={{ display: "flex",  }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                     
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <UploadFileIcon />
                          </InputAdornment>
                        ),
                      }}
                      type="file"
                      onChange={handleFileUpload}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
      {formSubmitted && response && displaySuccessAlert()}
    </ThemeProvider>
  );
};

export default IngresoPV;
