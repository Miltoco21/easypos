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
  DialogActions,
} from "@mui/material";

const EditarSubCategoria = ({ subcategory, open, handleClose }) => {
  const [editSubCategory, setEditSubCategory] = useState({
    idSubCategoria: "",
    descripcionSubCategoria: "",
  });
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (subcategory) {
      console.log("Subcategory:", subcategory);
      setEditSubCategory({
        idSubCategoria: subcategory.idCategoria || 0,
        descripcionSubCategoria: subcategory.descripcion || "",
      });
      setRefresh(false);
    }
  }, [subcategory,refresh]);

  const handleInputChange = (event) => {
    setEditSubCategory((prevEditSubCategory) => ({
      ...prevEditSubCategory,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put(
        `https://www.easyposdev.somee.com/api/NivelMercadoLogicos/UpdateSubCategoria`,
        {
          idSubCategoria: editSubCategory.idSubCategoria,
          descripcionSubCategoria: editSubCategory.descripcionSubCategoria,
        }
      );

      console.log("SubCategoria updated successfully:", response.data);
      handleClose();
      setSuccessDialogOpen(true)
      setRefresh(true); // Open success dialog
    } catch (error) {
      console.error("Error updating category:", error.response);
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
          <h2 id="modal-modal-title">Editar Sub-Categoria</h2>
          <form onSubmit={handleSubmit}>
            <TextField
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
    </>
  );
};

export default EditarSubCategoria;
