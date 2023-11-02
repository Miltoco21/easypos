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

const EditarProducto = ({
  open,
  handleClose,
  producto,
  fetchProveedores,
  onEditSuccess,
}) => {
  const [editProducto, setEditProducto] = useState({
    idProducto: "",
    nombre: "",
    categoria: "",
    subCategoria: "",
    familia: "",
    subFamilia: "",
    proveedor: "",
    bodega: "",
    precioCosto: "",
    unidad: "",
    stockInicial: "",
    precioVenta: "",
    formatoVenta: "",
    impuesto: "",
    stockCritico: "",
    nota: ""
  });

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditSuccessful, setIsEditSuccessful] = useState(false);

  useEffect(() => {
    if (producto) {
      setEditProducto({ 

        idProducto: producto.idProducto || "",
        nombre: producto.nombre || "",
        categoria: producto.categoria || "",
        subCategoria: producto.subCategoria || "",
        familia: producto.familia || "",
        subFamilia: producto.subFamilia || "",
        proveedor: producto.proveedor || "",
        bodega: producto.bodega || "",
        precioCosto: producto.precioCosto || "",
        unidad: producto.unidad || "",
        stockInicial: producto.stockInicial || "",
        precioVenta: producto.precioVenta || "",
        formatoVenta: producto.formatoVenta || "",
        impuesto: producto.impuesto || "",
        stockCritico: producto.stockCritico || "",
        nota: producto.nota || ""




      });
    }
  }, [producto]);
 
  console.log(editProducto);


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditProducto((prevEditProducto) => ({
      ...prevEditProducto,
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
  const handleEdit = (producto) => {
    setEditProveedor(producto);

    setIsEditSuccessful(false); // Reset the edit success state
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put(
        "https://www.easyposdev.somee.com/api/ProductosTmp/",
        editProducto
      );

      if (response.status === 200) {
        console.log("Producto updated successfully:", response.data);
        setIsEditSuccessful(true)

      } setSuccessDialogOpen(true)
    } catch (error) {
      console.error("Error updating producto:", error);
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
        <h2 id="modal-modal-title">Editar Producto</h2>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Código Proveedor"
                name="codigoProveedor"
                value={setEditProducto.idProducto}
                onChange={handleInputChange}
                fullWidth
              />
               <TextField
                label="Nombre"
                name="codigoProveedor"
                value={setEditProducto.nombre}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            {/* <Grid item xs={12} sm={3}>
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
            </Grid> */}
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

export default EditarProducto;
