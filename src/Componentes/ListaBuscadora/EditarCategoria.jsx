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
} from "@mui/material";

const EditarCategoria = ({ category, open, handleClose }) => {
  const [editCategory, setEditCategory] = useState({
    idCategoria: 0,
    descripcionCategoria: ""
  });
  const apiUrl = import.meta.env.VITE_URL_API2;
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (category) {
      console.log('category:', category);
      setEditCategory({
        idCategoria: category.idCategoria || 0,
        descripcionCategoria: category.descripcion || "",
      });
    }
  }, [category]);

  const handleInputChange = (event) => {
    setEditCategory((prevEditCategory) => ({
      ...prevEditCategory,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put(
         `${import.meta.env.VITE_URL_API2}/NivelMercadoLogicos/UpdateCategoria`,
        {
          idCategoria: editCategory.idCategoria,
          descripcionCategoria: editCategory.descripcionCategoria,
        }
      );

      console.log("Category updated successfully:", response.data);
      handleClose();
      setSuccessDialogOpen(true); // Open success dialog
    } catch (error) {
      console.error("Error updating category:", error.response);
      setErrorMessage(error.response.data.descripcion);
      setOpenErrorDialog(true);
    }
  };

  const closeSuccessDialog = () => {
    setSuccessDialogOpen(false);
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
          <h2 id="modal-modal-title">Editar Categoria</h2>
          <form onSubmit={handleSubmit}>
            <TextField
            sx={{display:"none"}}
              label="ID Categoria"
              name="idCategoria"
              value={editCategory.idCategoria}
              InputProps={{ readOnly: true }}
            />

            <TextField
              label="Descripcion"
              name="descripcionCategoria"
              value={editCategory.descripcionCategoria}
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
      <Dialog open={successDialogOpen} onClose={closeSuccessDialog}>
        <DialogTitle>Edición Exitosa!</DialogTitle>
        <DialogContent>Categoria editada correctamente.</DialogContent>
        <DialogActions>
          <Button onClick={closeSuccessDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openErrorDialog} onClose={() => setOpenErrorDialog(false)}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
          <DialogContentText>Ingrese una nueva y repita el proceso</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenErrorDialog(false)} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditarCategoria;
