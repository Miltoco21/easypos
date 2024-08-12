/* eslint-disable no-redeclare */
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
  Snackbar
} from "@mui/material";

const Editp2 = ({ product, open, handleClose }) => {
  const apiUrl = import.meta.env.VITE_URL_API2;

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

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  console.log("prodcuto a editar:",editedProduct)

  useEffect(() => {
    setEditedProduct(product);
    setSelectedCategoryId(product.idCategoria);
    setSelectedSubCategoryId(product.idsubCategoria);
    setSelectedFamilyId(product.idFamilia);
    setSelectedSubFamilyId(product.idSubFamilia);
  }, [product]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(
          "https://www.easypos.somee.com/api/NivelMercadoLogicos/GetAllCategorias"
        );
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
            `https://www.easypos.somee.com/api/NivelMercadoLogicos/GetSubCategoriaByIdCategoria?CategoriaID=${selectedCategoryId}`
          );
          setSubCategories(response.data.subCategorias);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      }
    };

    fetchSubCategories();
  }, [selectedCategoryId]);

  useEffect(() => {
    const fetchFamilies = async () => {
      if (selectedSubCategoryId !== "" && selectedCategoryId !== "") {
        try {
          const response = await axios.get(
            `https://www.easypos.somee.com/api/NivelMercadoLogicos/GetFamiliaByIdSubCategoria?SubCategoriaID=${selectedSubCategoryId}`
          );
          setFamilies(response.data.familias);
        } catch (error) {
          console.error("Error fetching families:", error);
        }
      }
    };

    fetchFamilies();
  }, [selectedCategoryId, selectedSubCategoryId]);

  useEffect(() => {
    const fetchSubFamilies = async () => {
      if (
        selectedFamilyId !== "" &&
        selectedCategoryId !== "" &&
        selectedSubCategoryId !== ""
      ) {
        try {
          const response = await axios.get(
            `https://www.easypos.somee.com/api/NivelMercadoLogicos/GetSubFamiliaByIdFamilia?FamiliaID=${selectedFamilyId}`
          );
          setSubFamilies(response.data.subFamilias);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      }
    };

    fetchSubFamilies();
  }, [selectedFamilyId, selectedCategoryId, selectedSubCategoryId]);

  const closeSuccessDialog = () => {
    setSuccessDialogOpen(false);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      categoria: categoryId,
    }));
  };

  const handleSubCategorySelect = (subCategoryId) => {
    setSelectedSubCategoryId(subCategoryId);
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      subCategoria: subCategoryId,
    }));
  };

  const handleFamilySelect = (familyId) => {
    setSelectedFamilyId(familyId);
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      familia: familyId,
    }));
  };

  const handleSubFamilySelect = (subFamilyId) => {
    setSelectedSubFamilyId(subFamilyId);
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      subFamilia: subFamilyId,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    console.log("Before Update:", editedProduct);

    let updatedProduct = {
      ...editedProduct,
      categoria: selectedCategoryId,
      subCategoria: selectedSubCategoryId,
      familia: selectedFamilyId,
      subFamilia: selectedSubFamilyId,
    };

    console.log("Updated Object:", updatedProduct);

    try {
      const response = await axios.put(
        `${apiUrl}/ProductosTmp/UpdateProducto`,
        updatedProduct
      );
      console.log("API Response:", response.data);

      if (response.status === 200) {
        console.log("Producto updated successfully:", response.data);
       
        setSnackbarMessage("Producto editado correctamente"); 
        setSnackbarOpen(true);

        setTimeout(() => {
          handleClose();
           setRefresh((prevRefresh) => !prevRefresh);
        }, 2000);
       
      }
    } catch (error) {
      console.error("Error updating producto:", error);
      if (error.response) {
        console.log("Server Error Response:", error.response.data);
      }
      setErrorMessage(error.message);
      setOpenErrorDialog(true);
    }

   
  };
  const handleNumericKeyDown = (event) => {
    const key = event.key;
    const input = event.target.value;

    // Verifica si el carácter es un número, backspace o delete
    if (
      !/\d/.test(key) && // números
      key !== "Backspace" && // backspace
      key !== "Delete" // delete
    ) {
      event.preventDefault();
    }

    // Previene espacios iniciales y al final de la cadena
    if (key === " " && (input.length === 0 || input.endsWith(" "))) {
      event.preventDefault();
    }
  };

  const handleTextKeyDown = (event) => {
    const key = event.key;
    const input = event.target.value;

    // Verifica si el carácter es alfanumérico o uno de los caracteres permitidos
    if (
      !/^[a-zA-Z0-9]$/.test(key) && // letras y números
      key !== " " && // espacio
      key !== "Backspace" && // backspace
      key !== "Delete" // delete
    ) {
      event.preventDefault();
    }

    // Previene espacios iniciales y al final de la cadena
    if (key === " " && (input.length === 0 || input.endsWith(" "))) {
      event.preventDefault();
    }
  };
  const handleEmailKeyDown = (event) => {
    const charCode = event.which ? event.which : event.keyCode;

    // Prevenir espacios en cualquier parte del correo
    if (charCode === 32) {
      // 32 es el código de la tecla espacio
      event.preventDefault();
    }
  };
  const handleRUTKeyDown = (event) => {
    const key = event.key;
    const input = event.target.value;

    // Permitir números (0-9), guion (-), backspace y delete
    if (
      !isNaN(key) || // números
      key === "Backspace" || // backspace
      key === "Delete" || // delete
      (key === "-" && !input.includes("-")) // guion y no hay guion previamente
    ) {
      // Permitir la tecla
    } else {
      // Prevenir cualquier otra tecla
      event.preventDefault();
    }

    // Prevenir espacios iniciales y asegurar que el cursor no esté en la posición inicial
    if (
      key === " " &&
      (input.length === 0 || event.target.selectionStart === 0)
    ) {
      event.preventDefault();
    }
  };

  const handleTextOnlyKeyDown = (event) => {
    const key = event.key;
    const input = event.target.value;

    // Verifica si el carácter es una letra (mayúscula o minúscula), espacio, backspace o delete
    if (
      !/[a-zA-Z]/.test(key) && // letras mayúsculas y minúsculas
      key !== " " && // espacio
      key !== "Backspace" && // backspace
      key !== "Delete" // delete
    ) {
      event.preventDefault();
    }

    // Previene espacios iniciales y al final de la cadena
    if (key === " " && (input.length === 0 || input.endsWith(" "))) {
      event.preventDefault();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Editar Producto</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} marginTop={1}>
          <Grid item xs={6}>
            <TextField
              name="nombre"
              label="Nombre Producto"
              value={editedProduct.nombre || ""}
              onKeyDown={handleTextOnlyKeyDown}
              onChange={(e) => {
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  nombre: e.target.value,
                }));
              }}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
          
            <TextField
            select
              fullWidth
              value={selectedCategoryId}
              onChange={(e) => handleCategorySelect(e.target.value)}
              label="Selecciona Categoría"
            >
             
              {categories.map((category) => (
                <MenuItem
                  key={category.idCategoria}
                  value={category.idCategoria}
                >
                  {category.descripcion}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6}>
           
            <TextField 
            select
              fullWidth
              value={selectedSubCategoryId || ""}
              onChange={(e) => handleSubCategorySelect(e.target.value)}
              label="Selecciona Sub-Categoría"
            >

              {subcategories.map((subcategory) => (
                <MenuItem
                  key={subcategory.idSubcategoria}
                  value={subcategory.idSubcategoria}
                >
                  {subcategory.descripcion}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
            select
              fullWidth
              value={selectedFamilyId || ""}
              onChange={(e) => handleFamilySelect(e.target.value)}
              label="Selecciona Familia"
            >
              {families.map((family) => (
                <MenuItem key={family.idFamilia} value={family.idFamilia}>
                  {family.descripcion}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              value={selectedSubFamilyId || ""}
              onChange={(e) => handleSubFamilySelect(e.target.value)}
              label="Selecciona Subfamilia"
            >    
              {subfamilies.map((subfamily) => (
                <MenuItem
                  key={subfamily.idSubFamilia}
                  value={subfamily.idSubFamilia}
                >
                  {subfamily.descripcion}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              name="marca"
              label="Marca"
              value={editedProduct.marca || ""}
              onKeyDown={handleTextOnlyKeyDown}
              onChange={(e) => {
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  marca: e.target.value,
                }));
              }}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              name="precioCosto"
              label="Precio Costo"
              value={editedProduct.precioCosto }
              onKeyDown={handleNumericKeyDown}
              onChange={(e) => {
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  precioCosto: e.target.value,
                }));
              }}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              name="precioVenta"
              label="Precio Venta"
              value={editedProduct.precioVenta }
              onKeyDown={handleNumericKeyDown}
              onChange={(e) => {
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  precioVenta: e.target.value,
                }));
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="StockInicial"
              label="Stock Inicial"
              onKeyDown={handleNumericKeyDown}
              value={editedProduct.stockInicial }
              onChange={(e) => {
                const numericValue = Number(e.target.value);
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  stockInicial: numericValue,
                }));
              }}
              // onChange={(e) => {
              //   setEditedProduct((prevProduct) => ({
              //     ...prevProduct,
              //     stockInicial: e.target.value,
              //   }));
              // }}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="StockCritico"
              label="Stock Crítico"
              value={editedProduct.stockCritico}
              onKeyDown={handleNumericKeyDown}
              onChange={(e) => {
                const numericValue = Number(e.target.value);
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  stockCritico: numericValue,
                }));
              }}
              // onChange={(e) => {
              //   setEditedProduct((prevProduct) => ({
              //     ...prevProduct,
              //     stockInicial: e.target.value,
              //   }));
              // }}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSave} color="primary">
          Guardar Cambios
        </Button>
      </DialogActions>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Dialog>
  );
};

export default Editp2;

