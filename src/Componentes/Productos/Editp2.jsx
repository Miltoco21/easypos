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
  TextField,
  Button,
  MenuItem,
  InputLabel,
  Select,
} from "@mui/material";

const Editp2 = ({ product, open, handleClose }) => {
  const [editedProduct, setEditedProduct] = useState({});

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [selectedFamilyId, setSelectedFamilyId] = useState("");
  const [selectedSubFamilyId, setSelectedSubFamilyId] = useState("");
  const [subcategories, setSubCategories] = useState([]);
  const [families, setFamilies] = useState([]);
  const [subfamilies, setSubFamilies] = useState([]);
  const [descripcionSubFamilia, setDescripcionSubFamilia] = useState("");

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

  const handleSave = () => {
    // Implement the logic to save the edited product
    // This can involve an API call to update the product details
    // For the sake of example, here's a console log of the edited product
    console.log("Edited Product:", editedProduct);
    // Additional logic to update the product in the database can be added here
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Editar Producto</DialogTitle>
      <DialogContent>
        <TextField
          name="nombre"
          label="Product Name"
          value={editedProduct.nombre || ""}
          onChange={handleFieldChange}
        />

        <InputLabel>Selecciona Categoría</InputLabel>
        <Select
          fullWidth
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          label="Selecciona Categoría"
        >
          <MenuItem
            key={editedProduct.id}
            value={editedProduct.categoria || ""}
          >
            {editedProduct.categoria}
          </MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.idCategoria} value={category.idCategoria}>
              {category.descripcion}
            </MenuItem>
          ))}
        </Select>

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

        <InputLabel>Selecciona Familia </InputLabel>
        <Select
          fullWidth
          value={selectedFamilyId}
          onChange={(e) => setSelectedFamilyId(e.target.value)}
          label="Selecciona Familia"
        >
          <MenuItem key={editedProduct.id} value={editedProduct.familia || ""}>
            {editedProduct.familia}
          </MenuItem>
          {families.map((family) => (
            <MenuItem key={family.idFamilia} value={family.idFamilia}>
              {family.descripcion}
            </MenuItem>
          ))}
        </Select>

        <InputLabel>Selecciona Sub Familia </InputLabel>
        <Select
          fullWidth
          value={selectedSubFamilyId}
          onChange={(e) => setSelectedSubFamilyId(e.target.value)}
          label="Selecciona Familia"
        >
          
          <MenuItem key={editedProduct.id} value={editedProduct.subFamilia || ""}>
            {editedProduct.subFamilia}
          </MenuItem>
          {subfamilies.map((subfamily) => (
            <MenuItem key={subfamily.idFamilia} value={subfamily.idFamilia}>
              {family.descripcion}
            </MenuItem>
          ))}
        </Select>
        

        {/* Add more fields here for other product details */}
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
        <Button variant="contained" onClick={handleClose}>
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default Editp2;
