/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, TextField, Table, TableBody, TableCell, TableHead, TableRow,MenuItem } from "@mui/material";


const SearchListSubCategories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [subcategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetAllCategorias");
        setCategories(response.data.categorias);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
  
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (selectedCategoryId !== "") {
        try {
          const response = await axios.get(`https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetSubCategoriaByIdCategoria?CategoriaID=${selectedCategoryId}`);
          console.log("https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetSubCategoriaByIdCategoria?$CategoriaID={selectedCategoryId}");
          console.log("Subcategories Response:", response.data.subCategorias);
          setSubCategories(response.data.subCategorias);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      }
    };
  
    fetchSubCategories();
  }, [selectedCategoryId]);

  useEffect(() => {
    if (Array.isArray(subcategories)) {
      setFilteredSubCategories(
        subcategories.filter((subcategory) =>
          subcategory.descripcion && subcategory.descripcion.trim().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, subcategories]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategoryId(event.target.value);
  };

  return (
    <Box sx={{ p: 2, mb: 4 }}>
      <TextField label="Search subcategory..." value={searchTerm} onChange={handleSearch} />
      <Box sx={{ mt: 2 }}>
        <TextField
          select
          label="Select Category"
          value={selectedCategoryId}
          onChange={handleCategoryChange}
          fullWidth
        >
          {categories.map((category) => (
            <MenuItem key={category.idCategoria} value={category.idCategoria}>
              {category.descripcion}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID Sub-Category</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredSubCategories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2}>No subcategories found</TableCell>
            </TableRow>
          ) : (
            filteredSubCategories.map((subcategory) => (
              <TableRow key={subcategory.idSubcategoria}>
                <TableCell>{subcategory.idSubcategoria}</TableCell>
                <TableCell>{subcategory.descripcion}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default SearchListSubCategories;









