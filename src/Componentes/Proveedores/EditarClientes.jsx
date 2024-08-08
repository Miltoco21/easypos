/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Snackbar,
  Grid,
} from "@mui/material";
import axios from "axios";

const EditarCliente = ({ open, handleClose, cliente, onEditSuccess }) => {
  const apiUrl = import.meta.env.VITE_URL_API2;
  const [editedCliente, setEditedCliente] = useState({});
  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedComuna, setSelectedComuna] = useState("");

  useEffect(() => {
    setEditedCliente(cliente);
    setSelectedRegion(cliente.region|| ""); // Asume que cliente.region es el ID de la región
    setSelectedComuna(cliente.comuna|| ""); // Asume que cliente.comuna es el nombre de la comuna
  }, [cliente]);

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
      // Obtener comunas para la región seleccionada
      axios
        .get(
          `https://www.easypos.somee.com/api/RegionComuna/GetComunaByIDRegion?IdRegion=${selectedRegion}`
        )
        .then((response) => {
          setComunas(response.data.comunas);
        })
        .catch((error) => {
          console.error("Error al obtener las comunas:", error);
        });
    }
  }, [selectedRegion]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedCliente((prevCliente) => ({
      ...prevCliente,
      [name]: value,
    }));
  };

  const handleRegionChange = (event) => {
    const selectedRegionId = event.target.value;
    setSelectedRegion(selectedRegionId);
    setSelectedComuna(""); // Resetear la comuna seleccionada cuando se cambia la región
  };

  const handleSaveChanges = async () => {
    try {
      const updatedCliente = {
        ...editedCliente,
        region: selectedRegion.toString(),
        comuna: selectedComuna,
      };

      const response = await axios.put(
        `${apiUrl}/Clientes/PutClienteCliente`,
        updatedCliente
      );

      if (response.status === 200) {
        setSnackbarMessage(response.data.descripcion);
        setSnackbarOpen(true);
        onEditSuccess();
      } else {
        throw new Error("No se pudo editar el cliente");
      }
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      if (error.response) {
        console.error("Respuesta de error del servidor:", error.response);
      } else if (error.request) {
        console.error("Solicitud sin respuesta:", error.request);
      } else {
        console.error("Error general:", error.message);
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar Cliente</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre"
                name="nombre"
                value={editedCliente.nombre || ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Dirección"
                name="direccion"
                value={editedCliente.direccion || ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Giro"
                name="giro"
                value={editedCliente.giro || ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Teléfono"
                name="telefono"
                value={editedCliente.telefono || ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                select
                label="Región"
                value={selectedRegion}
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
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                error={!!errors.comuna}
                select
                label="Comuna"
                value={selectedComuna}
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
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
          <Button onClick={handleSaveChanges} color="primary">
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </>
  );
};

export default EditarCliente;
