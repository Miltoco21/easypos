/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState ,useEffect} from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

const UserDetailsModal = ({ selectedUser, open, handleClose, handleSave }) => {
  const [editedUser, setEditedUser] = useState(selectedUser || {});

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

  return (
    <Modal open={open} onClose={handleClose}
    sx={{ height: "70vh", width: "100%" }}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          
        }}
      >
        <Typography variant="h4" gutterBottom>
          Editar Usuarios
        </Typography>
        <TextField
          label="Nombres"
          name="nombres"
          value={editedUser.nombres || ""}
          onChange={handleInputChange}
          fullWidth
          sx={{ my: 2 }}
        />
        <TextField
          label="Apellidos"
          name="apellidos"
          value={editedUser.apellidos || ""}
          onChange={handleInputChange}
          fullWidth
          sx={{ my: 2 }}
        />
        <TextField
          label="Teléfono"
          name="telefono"
          value={editedUser.telefono || ""}
          onChange={handleInputChange}
          fullWidth
          sx={{ my: 2 }}
        />
        <TextField
          label="Dirección"
          name="direccion"
          value={editedUser.direccion || ""}
          onChange={handleInputChange}
          fullWidth
          sx={{ my: 2 }}
        />
        <TextField
          label="Código Postal"
          name="codigoPostal"
          value={editedUser.codigoPostal || ""}
          onChange={handleInputChange}
          fullWidth
          sx={{ my: 2 }}
        />
        <TextField
          label="Comuna"
          name="comuna"
          value={editedUser.comuna || ""}
          onChange={handleInputChange}
          fullWidth
          sx={{ my: 2 }}
        />
        <TextField
          label="Región"
          name="region"
          value={editedUser.region || ""}
          onChange={handleInputChange}
          fullWidth
          sx={{ my: 2 }}
        />
        {/* <TextField
          label="Clave"
          name="clave"
          value={editedUser.clave || ""}
          onChange={handleInputChange}
          fullWidth
          sx={{ my: 2 }}
        /> */}
        <TextField
          label="Correo"
          name="correo"
          value={editedUser.correo || ""}
          onChange={handleInputChange}
          fullWidth
          sx={{ my: 2 }}
        />
        {/* Add more input fields as needed */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSave(editedUser)}
        >
          Guardar
        </Button>
        <Button variant="contained" onClick={handleClose} sx={{ ml: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default UserDetailsModal;
