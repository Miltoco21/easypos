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

const EditarSubFamilia = ({
  subfamily,
  open,
  handleClose,
  fetchSubfamilies,
}) => {
  const [editSubFamily, setEditSubFamily] = useState({
    idSubFamilia: "",
    descripcion: "",
  });
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const apiUrl = import.meta.env.VITE_URL_API2;

  useEffect(() => {
    if (subfamily) {
      setEditSubFamily({
        idSubFamilia: subfamily.idSubFamilia || 0,
        descripcion: subfamily.descripcion || "",
      });
    }
  }, [subfamily]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditSubFamily((prevEditSubFamily) => ({
      ...prevEditSubFamily,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_URL_API2}/NivelMercadoLogicos/UpdateSubFamilia`,
        {
          idSubFamilia: editSubFamily.idSubFamilia,
          descripcionSubFamilia: editSubFamily.descripcion,
        }
      );

      console.log("SubFamilia updated successfully:", response.data);

      setSuccessDialogOpen(true);
      fetchSubfamilies(); // Update subfamilies list
      handleClose();
    } catch (error) {
      console.error("Error updating subfamily:", error.response);

      if (error.response && error.response.status === 400) {
        const errorMessage =
          error.response.data.descripcion || "Ha ocurrido un error";
        setOpenErrorDialog(true);
        setErrorMessage(errorMessage);
      } else {
        // Handle other errors
        const errorMessage = "An error occurred";
        setOpenErrorDialog(true);
        setErrorMessage(errorMessage);
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
          <h2 id="modal-modal-title">Editar Subfamilia</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              sx={{ display: "none" }}
              label="ID SubFamilia"
              name="idSubFamilia"
              value={editSubFamily.idSubFamilia}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Descripcion"
              name="descripcion"
              value={editSubFamily.descripcion}
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
        <DialogContent>Subfamilia editada correctamente.</DialogContent>
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
          <DialogContentText>
            Ingrese una nueva y repita el proceso
          </DialogContentText>
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

export default EditarSubFamilia;
