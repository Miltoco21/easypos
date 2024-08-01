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

const EditarSubCategoria = ({
  subcategory,
  open,
  handleClose,
  fetchSubcategories,
}) => {
  const [editSubCategory, setEditSubCategory] = useState({
    idSubCategoria: "",
    descripcionSubCategoria: "",
  });
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [refresh, setRefresh] = useState(false);
  const apiUrl = import.meta.env.VITE_URL_API2;
  useEffect(() => {
    if (subcategory) {
      console.log("Subcategory:", subcategory);
      setEditSubCategory({
        idSubCategoria: subcategory.idCategoria || 0,
        descripcionSubCategoria: subcategory.descripcion || "",
      });
    }
  }, [subcategory]);

  useEffect(() => {
    if (refresh) {
      setRefresh(false);
    }
  }, [refresh]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditSubCategory((prevEditSubCategory) => ({
      ...prevEditSubCategory,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const dataToSend = {
      idSubCategoria: editSubCategory.idSubCategoria,
      descripcionSubCategoria: editSubCategory.descripcionSubCategoria,
    };
  
    console.log("Datos que se enviarán al servidor:", dataToSend);
  
    try {
      const response = await axios.put(
        `${apiUrl}/NivelMercadoLogicos/UpdateSubCategoria`,
        dataToSend
      );
  
      console.log("Datos enviados:", response.data);
      console.log("SubCategoria updated successfully:", response.data);
  
      setSuccessDialogOpen(true);
      fetchSubcategories(); // Actualizar lista de subcategorías
      handleClose();
    } catch (error) {
      console.error("Error updating category:", error.response);
      setErrorMessage(error.response.data.descripcion);
      setOpenErrorDialog(true);
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
          <h2 id="modal-modal-title">Editar Sub-Categoria</h2>
          <form onSubmit={handleSubmit}>
            <TextField
            sx={{display:"none"}}
              label="ID SubCategoria"
              name="idSubCategoria"
              value={editSubCategory.idSubCategoria}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Descripcion"
              name="descripcionSubCategoria"
              value={editSubCategory.descripcionSubCategoria}
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
        <DialogContent>Sub-Categoria editada correctamente.</DialogContent>
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

export default EditarSubCategoria;
