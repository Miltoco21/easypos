/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
} from "@mui/material";

const Step2Component = () => {
  const [selectedBodegaId, setSelectedBodegaId] = useState("");
  const [selectedProveedorId, setSelectedProveedorId] = useState("");
  const [selectedFamilyId, setSelectedFamilyId] = useState("");
  const [selectedSubFamilyId, setSelectedSubFamilyId] =  useState("");
  const [bodegas, setBodegas] = useState([]);
  const [proveedor, setProveedor] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [families, setFamilies] = useState([]);
  const [subfamilies, setSubFamilies] = useState([]);
  const [respuestaSINO, setRespuestaSINO] = useState("");
  const [nombre, setNombre] = useState("");
  const [marca, setMarca] = useState("");


  const [openDialog1, setOpenDialog1] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [openDialog3, setOpenDialog3] = useState(false);
  
  const [bodega, setBodega] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [newFamily, setNewFamily] = useState("");
 

  const handleRespuesta = (e) => {
    setRespuestaSINO(e.target.value);
  };

  const handleOpenDialog1 = () => {
    setOpenDialog1(true);
  };
  const handleCloseDialog1 = () => {
    setOpenDialog1(false);
  };
  const handleOpenDialog2 = () => {
    setOpenDialog2(true);
  };
  const handleCloseDialog2 = () => {
    setOpenDialog2(false);
  };
  // const handleOpenDialog3 = () => {
  //   setOpenDialog3(true);
  // };
  const handleCloseDialog3 = () => {
    setOpenDialog3(false);
  };
  // const handleOpenDialog4 = () => {
  //   setOpenDialog4(true);
  // };
  

  // Define selection-related functions
  const handleBodegaSelect = (bodegaId) => {
    setSelectedBodegaId(bodegaId);
  };

  const handleProveedorSelect = (proveedorId) => {
    setSelectedProveedorId(proveedorId);
  };

  const handleFamilySelect = (familyId) => {
    setSelectedFamilyId(familyId);
  };

  const handleSubFamilySelect = (subFamilyId) => {
    setSelectedSubFamilyId(subFamilyId);
  };
  const handleCreateCategory = () => {
    // Implement the logic to create a new category here.
    // You can use the newCategory state to get the input value.

    // After creating the category, you can close the dialog.
    setOpenDialog1(false);
  };
  const handleCreateSubCategory = () => {
    // Implement the logic to create a new category here.
    // You can use the newCategory state to get the input value.

    // After creating the category, you can close the dialog.
    setOpenDialog2(false);
  };
  const handleCreateFamily = () => {
    // Implement the logic to create a new category here.
    // You can use the newCategory state to get the input value.

    // After creating the category, you can close the dialog.
    setOpenDialog3(false);
  };
  
  const handlebodegaSelect = (bodegaId) => {
    setSelectedBodegaId(bodegaId);
  };
  
  useEffect(() => {
    async function fetchBodegas() {
      try {
        const response = await axios.get(
          "https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetAllBodegas"
        );
        setBodegas(response.data.categorias);
      } catch (error) {
        console.log(error);
      }
    }

    fetchBodegas();
  }, []);

  

  
  return (
    <Paper
      elevation={3}
      style={{
        padding: "16px",
        width: "830px",
      }}
    >
      <Box>
        <Box item md={7}>
          <InputLabel>Ingresa Bodega</InputLabel>
        <Select
          sx={{width:'700px'}}
          value={selectedBodegaId}
          onChange={(e) => handlebodegaSelect(e.target.value)}
          label="Selecciona Bodega"
        >
          {bodegas.map((bodega) => (
            <MenuItem key={bodega.idBodega} value={bodega.idBodega}>
              {bodega.descripcion}
            </MenuItem>
          ))}
        </Select>
        <Button
            size="large"
            variant="outlined"
            style={{ marginLeft: "18px", padding:"14px"}}
            onClick={handleOpenDialog1}
          >
            +
          </Button>
        </Box>
        


        <Box>
          <InputLabel>Ingresa Proveedor</InputLabel>
        <Select
         sx={{width:'700px'}}
          value={selectedProveedorId}
          onChange={(e) => handleProveedorSelect(e.target.value)}
          label="Selecciona Sub-Categoría"
        >
          {proveedores.map((proveedor) => (
            <MenuItem
              key={proveedor.idProveedor}
              value={proveedor.idProveedor}
            >
              {proveedor.descripcion}
            </MenuItem>
          ))}
        </Select>
        <Button
            size="large"
            variant="outlined"
            style={{ marginLeft: "18px", padding:"14px"}}
            onClick={handleOpenDialog2}
          >
            +
          </Button>


        </Box>
        

        
        
      </Box>

      

      
      <Dialog open={openDialog1} onClose={handleCloseDialog1}>
        <DialogTitle>Crear Bodega</DialogTitle>
        <DialogContent>
          <TextField
            label="Nueva Bodega"
            fullWidth
            value={bodega}
            onChange={(e) => setBodega(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog1} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleCreateCategory} color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog2} onClose={handleCloseDialog2}>
        <DialogTitle>Crear Proveedor</DialogTitle>
        <DialogContent>
          <TextField
            label="Nuevo Proveedor"
            fullWidth
            value={proveedor}
            onChange={(e) => setProveedor(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog2} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleCreateCategory} color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>

      


      
    </Paper>
  );
};

export default Step2Component;
