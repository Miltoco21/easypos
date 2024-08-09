/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  TextField,
  Button,
  Grid,
  Box,
  Dialog,
  Typography,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  MenuItem,
  Snackbar,
} from "@mui/material";

const EditarProveedor = ({
  open,
  handleClose,
  proveedor,
  fetchProveedores,
  onEditSuccess,
}) => {
  const apiUrl = import.meta.env.VITE_URL_API2;
  const [editedProveedor, setEditedProveedor] = useState([]);

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditSuccessful, setIsEditSuccessful] = useState(false);
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedComuna, setSelectedComuna] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  useEffect(() => {
    setEditedProveedor(proveedor);
    setSelectedRegion(proveedor.region || ""); // Asume que cliente.region es el ID de la región
    setSelectedComuna(proveedor.comuna || "");
  }, [proveedor]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedProveedor((prevEditedProveedor) => ({
      ...prevEditedProveedor,
      [name]: value,
    }));
  };

  const handleRegionChange = (event) => {
    const selectedRegionId = event.target.value;
    setSelectedRegion(selectedRegionId);
    setSelectedComuna(""); // Resetear la comuna seleccionada cuando se cambia la región
  };

  // const closeSuccessDialog = () => {
  //   setSuccessDialogOpen(false);
  //   handleClose();
  // };
  useEffect(() => {
    // Obtener regiones
    axios
      .get(`${apiUrl}/RegionComuna/GetAllRegiones`)
      .then((response) => {
        setRegiones(response.data.regiones);
      })
      .catch((error) => {
        console.error("Error al obtener las regiones:", error);
      });
  }, []);
  useEffect(() => {
    if (selectedRegion) {
      // Fetch comunas for the selected region
      axios
        .get(
          `${apiUrl}/RegionComuna/GetComunaByIDRegion?IdRegion=${selectedRegion}`
        )
        .then((response) => {
          setComunas(response.data.comunas);
        })
        .catch((error) => {
          console.error("Error fetching comunas:", error);
        });
    }
  }, [selectedRegion]);

  const closeErrorDialog = () => {
    setOpenErrorDialog(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const updatedProveedor = {
        ...editedProveedor,
        region: selectedRegion.toString(),
        comuna: selectedComuna,
      };
      const response = await axios.put(
        `${import.meta.env.VITE_URL_API2}/Proveedores/UpdateProveedor`,
        updatedProveedor
      );

      if (response.status === 200) {
        setEditedProveedor({
          codigoProveedor: "",
          razonSocial: "",
          giro: "",
          rut: "",
          email: "",
          telefono: "",
          direccion: "",
          region: "",
          comuna: "",
          pagina: "",
          formaPago: "",
          nombreResponsable: "",
          correoResponsable: "",
          telefonoResponsable: "",
          sucursal: "",
        });

        // Reset selected region and comuna
        setSelectedRegion("");
        setSelectedComuna("");
        setSnackbarOpen(true);

        setSnackbarMessage(response.data.descripcion);

        setTimeout(() => {
          handleClose();
          setSnackbarOpen(false);
          setSnackbarMessage("");
        }, 1000);
      }
    } catch (error) {
      console.error("Error updating proveedor:", error);
      setSnackbarOpen(true);

      setSnackbarMessage(error);
    }
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          width: "90vw",
          border: "rounded",
        }}
      >
        <h2 id="modal-modal-title">Editar Proveedor</h2>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3} sx={{ display: "none" }}>
              <TextField
                label="Código Proveedor"
                name="codigoProveedor"
                value={editedProveedor.codigoProveedor}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Razón Social"
                name="razonSocial"
                value={editedProveedor.razonSocial}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Giro"
                name="giro"
                value={editedProveedor.giro}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="RUT"
                name="rut"
                value={editedProveedor.rut}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Email"
                name="email"
                value={editedProveedor.email}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Teléfono"
                name="telefono"
                value={editedProveedor.telefono}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Dirección"
                name="direccion"
                value={editedProveedor.direccion}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Región"
                select
                value={selectedRegion}
                // value={editedProveedor.region}
                onChange={handleRegionChange}
                fullWidth
              >
                {regiones.map((region) => (
                  <MenuItem key={region.id} value={region.id}>
                    {region.regionNombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                // error={!!errors.comuna}
                select
                label="Comuna"
                // value={editedProveedor.comuna}
                value={selectedComuna}
                // onChange={handleInputChange}
                onChange={(e) => setSelectedComuna(e.target.value)}
                fullWidth
              >
                {comunas.map((comuna) => (
                  <MenuItem key={comuna.id} value={comuna.comunaNombre}>
                    {comuna.comunaNombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {/* <Grid item xs={12} sm={3}>
              <TextField
                label="Comuna"
                name="comuna"
                value={editProveedor.comuna}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Región"
                name="region"
                value={editProveedor.region}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid> */}
            <Grid item xs={12} sm={3}>
              <TextField
                label="Página"
                name="pagina"
                value={editedProveedor.pagina}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Forma de Pago"
                name="formaPago"
                value={editedProveedor.formaPago}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Nombre Responsable"
                name="nombreResponsable"
                value={editedProveedor.nombreResponsable}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Correo Responsable"
                name="correoResponsable"
                value={editedProveedor.correoResponsable}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Teléfono Responsable"
                name="telefonoResponsable"
                value={editedProveedor.telefonoResponsable}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Sucursal"
                name="sucursal"
                value={editedProveedor.sucursal}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
          </Grid>
          <Button variant="contained" color="primary" type="submit">
            Guardar
          </Button>
        </form>
        {/* {isEditSuccessful && (
          <Dialog open={successDialogOpen} onClose={closeSuccessDialog}>
            <DialogTitle> Edición Exitosa </DialogTitle>
            <DialogContent>
              <Typography>El Proveedor fue editado con éxito</Typography>
            </DialogContent>
          </Dialog>
        )}

        <Dialog open={openErrorDialog} onClose={closeErrorDialog}>
          <DialogTitle>Error</DialogTitle>
          <DialogContent>
            <DialogContentText>{errorMessage}</DialogContentText>
            <DialogContentText>
              Ingrese uno nuevo y repita el proceso
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeErrorDialog} color="primary">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog> */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
        />
      </Box>
    </Modal>
  );
};

export default EditarProveedor;
