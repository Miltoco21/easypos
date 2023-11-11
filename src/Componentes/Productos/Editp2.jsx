/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  InputLabel,
  Select,
  Grid,
  Typography,
} from "@mui/material";

const Editp2 = ({ product, open, handleClose }) => {
  const [editedProduct, setEditedProduct] = useState({});
  const [refresh, setRefresh] = useState(false);

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [selectedFamilyId, setSelectedFamilyId] = useState("");
  const [selectedSubFamilyId, setSelectedSubFamilyId] = useState("");
  const [subcategories, setSubCategories] = useState([]);
  const [families, setFamilies] = useState([]);
  const [subfamilies, setSubFamilies] = useState([]);
  const [descripcionSubFamilia, setDescripcionSubFamilia] = useState("");
  const [marcas, setMarcas] = useState([]);
  const [selectedBodegaId, setSelectedBodegaId] = useState(
    product.bodega || ""
  );
  const [selectedProveedorId, setSelectedProveedorId] = useState(
    product.proveedor || ""
  );

  const [bodegas, setBodegas] = useState([]);
  const [proveedor, setProveedor] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  const [selectedMarcaId, setSelectedMarcaId] = useState("");

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function fetchProveedores() {
      try {
        const response = await axios.get(
          "https://www.easyposdev.somee.com/api/Proveedores/GetAllProveedores"
        );
        console.log("API response:", response.data.proveedores);
        setProveedores(response.data.proveedores);
      } catch (error) {
        console.log(error);
      }
    }

    fetchProveedores();
  }, [refresh]);

  const handleProveedorSelect = (proveedorId) => {
    const selectedProveedor = proveedores.find((proveedor) => proveedor.id === proveedorId);
    if (selectedProveedor) {
      setSelectedProveedorId(selectedProveedor.nombreResponsable);
    }
  };

  const handleMarcaSelect = (MarcaId) => {
    setSelectedMarcaId(MarcaId);
    const selectedMarca = marcas.find((marca) => marca.id === MarcaId);
    if (selectedMarca) {
      setMarcas(selectedMarca.nombre); // Assuming 'nombre' holds the 'marca' value
    }
  };
  useEffect(() => {
    async function fetchMarcas() {
      try {
        const response = await axios.get(
          "https://www.easyposdev.somee.com/api/Marcas/GetAllMarcas"
        );
        setMarcas(response.data.marcas);
        console.log(response.data.marcas);
      } catch (error) {
        console.log(error);
      }
    }

    fetchMarcas();
  }, []);

  useEffect(() => {
    setSelectedMarcaId(editedProduct.marca || "");
  }, [editedProduct]);

  useEffect(() => {
    setSelectedCategoryId(editedProduct.categoria || "");
  }, [editedProduct]);

  useEffect(() => {
    setSelectedSubCategoryId(editedProduct.subCategoria || "");
  }, [editedProduct]);

  useEffect(() => {
    setSelectedFamilyId(editedProduct.familia || "");
  }, [editedProduct]);

  useEffect(() => {
    setSelectedSubFamilyId(editedProduct.subFamilia || "");
  }, [editedProduct]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(
          "https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetAllCategorias"
        );
        console.log("API response:", response.data.categorias); // Add this line
        setCategories(response.data.categorias);
      } catch (error) {
        console.log(error);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (selectedCategoryId !== "") {
        try {
          const response = await axios.get(
            `https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetSubCategoriaByIdCategoria?CategoriaID=${selectedCategoryId}`
          );

          console.log("Subcategories Response:", response.data.subCategorias);
          setSubCategories(response.data.subCategorias);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      }
    };

    fetchSubCategories();
  }, [selectedCategoryId]);

  //&& selectedFamilyId!= ""

  useEffect(() => {
    const fetchFamilies = async () => {
      if (selectedSubCategoryId !== "" && selectedCategoryId !== "") {
        try {
          const response = await axios.get(
            `https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetFamiliaByIdSubCategoria?SubCategoriaID=${selectedSubCategoryId}`
          );

          console.log("Families Response:", response.data.familias);
          setFamilies(response.data.familias);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      }
    };

    fetchFamilies();
  }, [selectedSubCategoryId]);

  useEffect(() => {
    const fetchSubFamilies = async () => {
      if (
        selectedFamilyId !== "" &&
        selectedCategoryId !== "" &&
        selectedSubCategoryId !== ""
      ) {
        try {
          const response = await axios.get(
            `https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetSubFamiliaByIdFamilia?FamiliaID=${selectedFamilyId}`
          );

          console.log("SubFamilies Response:", response.data.subFamilias);
          setSubFamilies(response.data.subFamilias);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      }
    };

    fetchSubFamilies();
  }, [selectedFamilyId]);

  useEffect(() => {
    // Set the edited product state when the product changes
    setEditedProduct(product);
  }, [product]);

  console.log("test", product);

  const handleFieldChange = (e) => {
    // Update the edited product state on field change
    const { name, value } = e.target;
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const closeSuccessDialog = () => {
    setSuccessDialogOpen(false);
  };

  const handleSave = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.put(
        'https://www.easyposdev.somee.com/api/ProductosTmp/UpdateProducto',
        editedProduct

        

      );
      console.log('API Response:', response.data);
  
      if (response.status === 201) {
        console.log("Producto updated successfully:", response.data);
        setIsEditSuccessful(true);
        setSuccessDialogOpen(true);
        setSuccessMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error updating producto:', error);
  console.log('Full error object:', error);

  if (error.response) {
    console.log('Server Response:', error.response.data);
  }

  setErrorMessage(error.message);
  setOpenErrorDialog(true);
      // if (error.response) {
      //   // The request was made and the server responded with a status code
      //   // that falls out of the range of 2xx
      //   console.log(error.response.data);
      //   console.log(error.response.status);
      //   console.log(error.response.headers);
      // } else if (error.request) {
      //   // The request was made but no response was received
      //   // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      //   // http.ClientRequest in Node.js
      //   console.log(error.request);
      // } else {
      //   // Something happened in setting up the request that triggered an Error
      //   console.log('Error', error.message);
      // }
      // console.error("Error updating producto:", error);
      // console.error("Server Response:", error.response);
      // if (error.response && error.response.data && error.response.data.errors) {
      //   const { $, value } = error.response.data.errors;
      //   console.error("Validation Errors:", $, value);
      // }
      // setErrorMessage(error.message);
      // setOpenErrorDialog(true);
    }
  
    console.log("Edited Product:", editedProduct);
    // Additional logic to update the product in the database can be added here
    handleClose();
  };

  return (
    //fullScreen
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Editar Producto</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={8}>
            <TextField
              name="nombre"
              label="Nombre Producto"
              value={editedProduct.nombre || ""}
              onChange={handleFieldChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <InputLabel>Selecciona Categoría</InputLabel>
            <Select
              fullWidth
              value={selectedCategoryId}
              onChange={(e) => {
                setSelectedCategoryId(e.target.value);
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  categoria: e.target.value, // Update the categoria property
                }));
              }}
              
              label="Selecciona Categoría"
            >
              <MenuItem
                key={editedProduct.id}
                value={editedProduct.categoria || ""}
              >
                {editedProduct.categoria}
              </MenuItem>
              {categories.map((category) => (
                <MenuItem
                  key={category.idCategoria}
                  value={category.idCategoria}
                >
                  {category.descripcion}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={6}>
            <InputLabel>Selecciona Sub-Categoría</InputLabel>
            <Select
              fullWidth
              value={selectedSubCategoryId}
              onChange={(e) => setSelectedSubCategoryId(e.target.value)}
              label="Selecciona Sub-Categoría"
            >
              <MenuItem
                key={editedProduct.id}
                value={editedProduct.subCategoria || ""}
              >
                {editedProduct.subCategoria}
              </MenuItem>
              {subcategories.map((subcategory) => (
                <MenuItem
                  key={subcategory.idSubcategoria}
                  value={subcategory.idSubcategoria}
                >
                  {subcategory.descripcion}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={6}>
            <InputLabel>Selecciona Familia</InputLabel>
            <Select
              fullWidth
              value={selectedFamilyId}
              onChange={(e) => setSelectedFamilyId(e.target.value)}
              label="Selecciona Familia"
            >
              <MenuItem
                key={editedProduct.id}
                value={editedProduct.familia || ""}
              >
                {editedProduct.familia}
              </MenuItem>
              {families.map((family) => (
                <MenuItem key={family.idFamilia} value={family.idFamilia}>
                  {family.descripcion}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={6}>
            <InputLabel>Selecciona Sub Familia</InputLabel>
            <Select
              fullWidth
              value={selectedSubFamilyId}
              onChange={(e) => setSelectedSubFamilyId(e.target.value)}
              label="Selecciona Familia"
            >
              <MenuItem
                key={editedProduct.id}
                value={editedProduct.subFamilia || ""}
              >
                {editedProduct.subFamilia}
              </MenuItem>
              {subfamilies.map((subfamily) => (
                <MenuItem key={subfamily.idFamilia} value={subfamily.idFamilia}>
                  {subfamily.descripcion}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={6}>
            <InputLabel>Selecciona Marca</InputLabel>
            <Select
              fullWidth
              value={selectedMarcaId}
              onChange={(e) => handleMarcaSelect(e.target.value)}
              label="Selecciona Marca"
            >
              {Array.isArray(marcas) &&
                marcas.map((marca) => (
                  <MenuItem key={marca.id} value={marca.id}>
                    {marca.nombre}
                  </MenuItem>
                ))}
            </Select>
          </Grid>

          <Grid item xs={6}>
            <InputLabel>Ingresa Proveedor</InputLabel>
            <Select
              fullWidth
              value={selectedProveedorId}
              onChange={(e) => handleProveedorSelect(e.target.value)}
              label="Selecciona Sub-Categoría"
            >
              {proveedores.map((proveedor) => (
                <MenuItem
                  key={proveedor.id}
                  value={proveedor.nombreResponsable}
                >
                  {proveedor.nombreResponsable}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={6}>
            <TextField
              name="precioCosto"
              label="Precio Costo"
              value={editedProduct.precioCosto || ""}
              onChange={handleFieldChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              name="precioVenta"
              label="Precio Venta"
              value={editedProduct.precioVenta || ""}
              onChange={handleFieldChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              name="stockInicial"
              label="Stock Inicial"
              value={editedProduct.stockInicial || ""}
              onChange={handleFieldChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              name="stockCritico"
              label="Stock Crítico"
              value={editedProduct.stockCritico || ""}
              onChange={handleFieldChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
            <Button variant="contained" onClick={handleClose}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </DialogContent>

      <Dialog open={successDialogOpen} onClose={closeSuccessDialog}>
        <DialogTitle> Edición Exitosa </DialogTitle>
        <DialogContent>
          <Typography>{successMessage}</Typography>{" "}
          {/* Aquí se muestra el mensaje de éxito */}
        </DialogContent>
      </Dialog>

      <Dialog open={openErrorDialog} onClose={closeSuccessDialog}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
          <DialogContentText>
            Ingrese uno nuevo y repita el proceso
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSuccessDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default Editp2;
