/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";

const UserDetailsModal = ({ selectedUser, open, handleClose }) => {
  const [editedUser, setEditedUser] = useState(selectedUser || {});
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);



  useEffect(() => {
    setEditedUser(selectedUser || {});
  }, [selectedUser]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const updatedUser = {
      codigoUsuario: editedUser.codigoUsuario || 0,
      nombres: editedUser.nombres || "",
      apellidos: editedUser.apellidos || "",
      telefono: editedUser.telefono || "",
      direccion: editedUser.direccion || "",
      codigoPostal: editedUser.codigoPostal || "",
      comuna: editedUser.comuna || "",
      region: editedUser.region || "",
      clave: editedUser.clave || "",
      correo: editedUser.correo || "",
    };
    console.log(updatedUser,"1")

    try {
      // Send the updated user information to the endpoint using Axios
      const response = await axios.put(
        "https://www.easyposdev.somee.com/Usuarios/UpdateUsuario",
        updatedUser
        
      );
      console.log(updatedUser,"2")

      // Handle the response from the endpoint
      console.log(response.data);

      // Display success dialog
      setSuccessDialogOpen(true);
    } catch (error) {
      // Handle any errors
      console.error(error);

      // Display error dialog for 400 response code
      if (error.response && error.response.status === 400) {
        setErrorDialogOpen(true);
      }
    }
  };

  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
    handleClose();
  };

  const handleErrorDialogClose = () => {
    setErrorDialogOpen(false);
  };

  return (
    
    <Modal
    open={open}
    onClose={handleClose}
    sx={{ height: "90vh", width: "100%" }}
    style={{ height: "300px" }}
  >
    <div>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "20%",
          right: "20%",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Editar Usuarios
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombres"
              name="nombres"
              value={editedUser.nombres || ""}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Apellidos"
              name="apellidos"
              value={editedUser.apellidos || ""}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Teléfono"
              name="telefono"
              value={editedUser.telefono || ""}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Dirección"
              name="direccion"
              value={editedUser.direccion || ""}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Código Postal"
              name="codigoPostal"
              value={editedUser.codigoPostal || ""}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Comuna"
              name="comuna"
              value={editedUser.comuna || ""}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Región"
              name="region"
              value={editedUser.region || ""}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Correo"
              name="correo"
              value={editedUser.correo || ""}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ marginTop: 2 }}
        >
          Guardar
        </Button>
        <Button
          variant="contained"
          onClick={handleClose}
          sx={{ ml: 2, marginTop: 2 }}
        >
          Cerrar
        </Button>
      </Box>

      {/* Error Dialog */}
      <Dialog open={errorDialogOpen} onClose={handleErrorDialogClose}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
           Hubo un error en la edición
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleErrorDialogClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onClose={handleSuccessDialogClose}>
        <DialogTitle>Edición Exitosa!</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
          Se ha editado el usuario correctamente.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessDialogClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  </Modal>
   
  );
};

UserDetailsModal.propTypes = {
  selectedUser: PropTypes.object,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default UserDetailsModal;
