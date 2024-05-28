/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Navegacion from "../Componentes/NavBar/Navegacion";
import Button from "@mui/joy/Button";
import Add from "@mui/icons-material/Add";
import Modal from "@mui/joy/Modal";

import IngresoPV from "../Componentes/Proveedores/IngresoPV";
import IngresoCL from "../Componentes/Proveedores/IngresoCL";
import Familias from "../Componentes/Familias/Familias";
import SideBar from "../Componentes/NavBar/SideBar";
import SearchListProveedores from "../Componentes/Proveedores/SearchListProveedores";
import SearchListClientes from "../Componentes/Proveedores/SearchListClientes";

const Clientes = () => {
  const [open, setOpen] = useState(false);
  const [openCL, setOpenCL] = useState(false); // New state for IngresoCL modal
  const text = "Proovedores";
  const uppercaseText = text.toUpperCase();

  // Event handler to open the IngresoPV modal
  const handleOpenModal = () => {
    setOpen(true);
  };

  // Event handler to close the IngresoPV modal
  const handleCloseModal = () => {
    setOpen(false);
  };

  // Event handler to open the IngresoCL modal
  const handleOpenModalCL = () => {
    setOpenCL(true);
  };

  // Event handler to close the IngresoCL modal
  const handleCloseModalCL = () => {
    setOpenCL(false);
  };

  return (
    <div style={{ display: "flex" }}>
      <SideBar />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* <Button
          variant="outlined"
          color="primary"
          sx={{
            my: 1,
            mx: 2,
          }}
          startDecorator={<Add />}
          onClick={handleOpenModal}
        >
          {uppercaseText}
        </Button> */}

        {/* CLIENTES Button */}
        <Button
          variant="outlined"
          color="primary"
          sx={{
            my: 1,
            mx: 2,
          }}
          startDecorator={<Add />}
          onClick={handleOpenModalCL}
        >
          CLIENTES
        </Button>

        <SearchListClientes />

        <Box />

        {/* Modal for IngresoPV */}
        <Modal open={open} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              overflow: "auto", // Added scrollable feature
              maxHeight: "100vh", // Adjust as needed
              maxWidth: "180vw", // Adjust as needed
            }}
          >
            <IngresoPV />
          </Box>
        </Modal>

        {/* Modal for IngresoCL */}
        <Modal open={openCL} onClose={handleCloseModalCL}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              overflow: "auto", // Added scrollable feature
              maxHeight: "100vh", // Adjust as needed
              maxWidth: "180vw", // Adjust as needed
            }}
          >
            <IngresoCL handleCloseModalCL={handleCloseModalCL} />
          </Box>
        </Modal>
      </Box>
    </div>
  );
};

export default Clientes;
