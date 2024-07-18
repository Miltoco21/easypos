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
} from "@mui/material";

const EditarProveedor = ({
  open,
  handleClose,
  proveedor,
  fetchProveedores,
  onEditSuccess,
}) => {

  const apiUrl = import.meta.env.VITE_URL_API2;
  const [editProveedor, setEditProveedor] = useState({
    codigoProveedor: "",
    razonSocial: "",
    giro: "",
    rut: "",
    email: "",
    telefono: "",
    direccion: "",
    comuna: "",
    region: "",
    pagina: "",
    formaPago: "",
    nombreResponsable: "",
    correoResponsable: "",
    telefonoResponsable: "",
    sucursal: "",
  });

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditSuccessful, setIsEditSuccessful] = useState(false);

  useEffect(() => {
    if (proveedor) {
      setEditProveedor({
        codigoProveedor: proveedor.codigoProveedor || "",
        razonSocial: proveedor.razonSocial || "",
        giro: proveedor.giro || "",
        rut: proveedor.rut || "",
        email: proveedor.email || "",
        telefono: proveedor.telefono || "",
        direccion: proveedor.direccion || "",
        comuna: proveedor.comuna || "",
        region: proveedor.region || "",
        pagina: proveedor.pagina || "",
        formaPago: proveedor.formaPago || "",
        nombreResponsable: proveedor.nombreResponsable || "",
        correoResponsable: proveedor.correoResponsable || "",
        telefonoResponsable: proveedor.telefonoResponsable || "",
        sucursal: proveedor.sucursal || "",
      });
    }
  }, [proveedor]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditProveedor((prevEditProveedor) => ({
      ...prevEditProveedor,
      [name]: value,
    }));
  };
  const closeSuccessDialog = () => {
    setSuccessDialogOpen(false);
    handleClose();
  };

  const closeErrorDialog = () => {
    setOpenErrorDialog(false);
  };
  const handleEdit = (proveedor) => {
    setEditProveedor(proveedor);

    setIsEditSuccessful(false); // Reset the edit success state
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_URL_API2}/Proveedores/UpdateProveedor`,
        editProveedor
      );

      if (response.status === 200) {
        console.log("Proveedor updated successfully:", response.data);
        setIsEditSuccessful(true)

      } setSuccessDialogOpen(true)
    } catch (error) {
      console.error("Error updating proveedor:", error);
      setErrorMessage(error.message);
      setOpenErrorDialog(true);
    }
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
            <Grid item xs={12} sm={3}>
              <TextField
                label="Código Proveedor"
                name="codigoProveedor"
                value={editProveedor.codigoProveedor}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Razón Social"
                name="razonSocial"
                value={editProveedor.razonSocial}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Giro"
                name="giro"
                value={editProveedor.giro}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="RUT"
                name="rut"
                value={editProveedor.rut}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Email"
                name="email"
                value={editProveedor.email}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Teléfono"
                name="telefono"
                value={editProveedor.telefono}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Dirección"
                name="direccion"
                value={editProveedor.direccion}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
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
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Página"
                name="pagina"
                value={editProveedor.pagina}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Forma de Pago"
                name="formaPago"
                value={editProveedor.formaPago}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Nombre Responsable"
                name="nombreResponsable"
                value={editProveedor.nombreResponsable}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Correo Responsable"
                name="correoResponsable"
                value={editProveedor.correoResponsable}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Teléfono Responsable"
                name="telefonoResponsable"
                value={editProveedor.telefonoResponsable}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Sucursal"
                name="sucursal"
                value={editProveedor.sucursal}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
          </Grid>
          <Button variant="contained" color="primary" type="submit">
            Guardar
          </Button>
        </form>
        {isEditSuccessful && (
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
        </Dialog>
      </Box>
    </Modal>
  );
};

export default EditarProveedor;
