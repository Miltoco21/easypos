import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Button,
  TextField,
  MenuItem,
  DialogActions,
} from "@mui/material";
import axios from "axios";

const EditUsuario = ({ selectedUser, open, handleCloseEditModal }) => {
  const [editedUser, setEditedUser] = useState({});
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedComuna, setSelectedComuna] = useState(null);
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
        console.log("API response:", response.data.usuarios);
        setRoles(response.data.usuarios);
      } catch (error) {
        console.log(error);
      }
    }

    fetchRoles();
  }, []);

  // const handleSubmit = async () => {
  //   const formDataToSend = {
  //     ...formData,
  //     region: String(formData.region),
  //     comuna: String(formData.comuna),
  //   };
  // };

  useEffect(() => {
    // Update local state when selectedUser changes
    setEditedUser({ ...selectedUser });
  }, [selectedUser]);

  const handleFieldChange = (fieldName, value) => {
    setEditedUser((prevUser) => ({
      ...prevUser,
      [fieldName]: value,
    }));
  };
  const handleSubmit = async () => {
    const updatedUser = {
      ...editedUser,
      rol: selectedRol,
      region: String(selectedRegion),
      comuna: selectedComuna,
      clave: ""
    };

    console.log("Data to be sent:", updatedUser);

    try {
      const response = await axios.put(
        "https://www.easyposdev.somee.com/Usuarios/UpdateUsuario",
        updatedUser
      );
      console.log("Response from server:", response.data);
      // Puedes manejar la respuesta del servidor según tus necesidades
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };


  return (
    <Dialog open={open} onClose={handleCloseEditModal} maxWidth="md" fullWidth>
      <DialogTitle>Editar Usuario</DialogTitle>
      <DialogContent>
        {/* Editable fields inside the dialog */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre"
              value={editedUser.nombres}
              onChange={(e) => handleFieldChange("nombres", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Apellidos"
              value={editedUser.apellidos}
              onChange={(e) => handleFieldChange("apellidos", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Correo"
              value={editedUser.correo}
              onChange={(e) => handleFieldChange("correo", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Telefono"
              value={editedUser.telefono}
              onChange={(e) => handleFieldChange("telefono", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Dirección"
              value={editedUser.direccion}
              onChange={(e) => handleFieldChange("direccion", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="Rol"
              select
              label="Rol"
              value={selectedRol}
              onChange={(e) => setSelectedRol(e.target.value)}
              sx={{ marginTop: 2 }}
              fullWidth
            >
              {roles.map((rol) => (
                <MenuItem key={rol.idRol} value={rol.rol}>
                  {rol.rol}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="region"
              select
              label="Región"
              value={selectedRegion}
              onChange={(e) => {
                const regionID = e.target.value;
                setSelectedRegion(regionID);
                // setFormData((prevFormData) => ({
                //   ...prevFormData,
                //   region: regionID,
                // }));
              }}
            >
              {regionOptions.map((option) => (
                <MenuItem key={option.id} value={[option.id]}>
                  {option.regionNombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="comuna"
              select
              label="Comuna"
              value={selectedComuna}
              onChange={(e) => {
                const comunaValue = e.target.value;
                setSelectedComuna(comunaValue);
                // setFormData((prevFormData) => ({
                //   ...prevFormData,
                //   comuna: comunaValue,
                // }));
              }}
            >
              {comunaOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid>
            <Button onClick={handleSubmit} color="primary">
              Enviar
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseEditModal}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUsuario;
