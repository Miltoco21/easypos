/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { regionsData } from "../Usuarios/data.js";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Modal,
  Dialog,
  MenuItem,
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
  const [regionOptions, setRegionOptions] = useState([]);
  const [comunaOptions, setComunaOptions] = useState([]);
  const [selectedRol, setSelectedRol] = useState("");
  const [roles, setRoles] = useState([]);

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
      try {
        if (editedUser.region) {
          const response = await axios.get(
            `https://www.easyposdev.somee.com/api/RegionComuna/GetComunaByIDRegion?idRegion=${editedUser.region.id}`
          );
          setComunaOptions(response.data.comunas);
        } else {
          setComunaOptions([]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchComunas();
  }, [editedUser.region]);



  const handleInputChange = async (event) => {
    const { name, value } = event.target;
    if (name === 'region') {
      const selectedRegion = regionOptions.find((option) => option.regionNombre === value);
  
      try {
        const response = await axios.get(`https://www.easyposdev.somee.com/api/RegionComuna/GetComunaByIDRegion?idRegion=${selectedRegion.id}`);
        setComunaOptions(response.data.comunas);
      } catch (error) {
        console.error(error);
      }
    }
  
    // Handle setting the value in your state (editedUser or similar)
    // For example:
    // setEditedUser((prevEditedUser) => ({ ...prevEditedUser, [name]: value }));
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
      region: editedUser.region.toString() || "",
      clave: editedUser.clave || "",
      correo: editedUser.correo || "",
      rol: editedUser.rol || "",
    };
    console.log(updatedUser, "1");

    try {
      // Send the updated user information to the endpoint using Axios
      const response = await axios.put(
        "https://www.easyposdev.somee.com/Usuarios/UpdateUsuario",
        updatedUser
      );
      console.log(updatedUser, "2");

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
      sx={{ height: "100vh", width: "100%",margin:"1px" ,marginTop:"-80px"}}
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
                id="comuna"
                select
                label="Comuna"
                name="comuna"
                value={editedUser.comuna || ""}
                onChange={handleInputChange}
                fullWidth
              >
                {comunaOptions.map((comuna) => (
                  <MenuItem key={comuna.id} value={comuna.comunaNombre}>
                    {comuna.comunaNombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="region"
                select
                label="Región"
                name="region"
                value={editedUser.region || ""} //editedUser.region || ""
                onChange={handleInputChange}
                fullWidth
              >
                {regionOptions.map((option) => (
                  <MenuItem key={option.id} value={option.regionNombre}>
                    {option.regionNombre}
                  </MenuItem>
                ))}
              </TextField>
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
            <Grid item xs={12} sm={6}>
              <TextField
                label="Rol"
                name="Rol"
                value={editedUser.rol || ""}
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
            <Typography variant="body1">Hubo un error en la edición</Typography>
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
