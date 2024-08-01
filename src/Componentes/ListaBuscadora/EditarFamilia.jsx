/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  TextField,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar
} from "@mui/material";

const EditarFamilia = ({ open, handleClose, family, fetchFamilies }) => {
  const [editFamily, setEditFamily] = useState({
    idFamilia: "",
    descripcion: "", // Use the same property name as in the family object
  });
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const apiUrl = import.meta.env.VITE_URL_API2;

  useEffect(() => {
    if (family) {
      setEditFamily({
        idFamilia: family.idFamilia || 0,
        descripcion: family.descripcion || "", // Use the same property name as in the family object
      });
    }
  }, [family]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditFamily((prevEditFamily) => ({
      ...prevEditFamily,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_URL_API2}/NivelMercadoLogicos/UpdateFamilia`,
        {
          idFamilia: editFamily.idFamilia,
          descripcionFamilia: editFamily.descripcion,
        }
      );

      if (response.status === 200) {
        console.log("Familia updated successfully:", response.data);
        fetchFamilies(); // Update families list
        handleClose();
        setSuccessDialogOpen(true);
        setSnackbarOpen(true);
        setSnackbarMessage("Familia editada con éxito")
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error(
          "Error updating category:",
          error.response.data.descripcion
        );
        // Open the error dialog with the error message from the server
        setErrorMessage(error.response.data.descripcion);
        setSnackbarOpen(true);
      
        setSnackbarMessage(`Error,${error.response.data.descripcion}`)
      } else {
        console.error("Error updating category:", error);
      }
    }
  };

  const closeSuccessDialog = () => {
    setSuccessDialogOpen(false);
    handleClose();
  };

  return (
    <>
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
          }}
        >
          <h2 id="modal-modal-title">Editar Familia</h2>
          <form onSubmit={handleSubmit}>
            {/* <TextField
              label="ID Familia"
              name="idFamilia"
              value={editFamily.idFamilia}
              InputProps={{ readOnly: true }}
            /> */}
            <TextField
              label="Descripcion"
              name="descripcion"
              value={editFamily.descripcion}
              fullWidth
              onChange={handleInputChange}
              sx={{ my: 2 }}
            />

            <Button variant="contained" color="primary" type="submit">
              Guardar
            </Button>
          </form>
        </Box>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
      {/* <Dialog open={successDialogOpen} onClose={closeSuccessDialog}>
        <DialogTitle>Edición Exitosa!</DialogTitle>
        <DialogContent>Familia editada correctamente.</DialogContent>
        <DialogActions>
          <Button onClick={closeSuccessDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog> */}
      
   
    </>
  );
};

export default EditarFamilia;
