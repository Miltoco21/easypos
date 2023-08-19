/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  MenuItem,
  Input,
  Grid,
  Select,
  InputLabel,
} from "@mui/material";

const SearchListSubFamilias = ()=>{

  const [searchTerm, setSearchTerm] = useState("");
  const [families, setFamilies] = useState([]);
  const [subfamilies, setSubFamilies] = useState([]);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [subcategories, setSubCategories] = useState([]);
  const [filteredFamilies, setFilteredFamilies] = useState([]);
  const [errors, setErrors] = useState({ descripcionFamilia: "" });
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedFamilyId, setSelectedFamilyId] = useState("");

  const [descripcionFamilia, setDescripcionFamilia] = useState("");

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
          console.log(
            "https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetSubCategoriaByIdCategoria?$CategoriaID={selectedCategoryId}"
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

  useEffect(() => {
    const fetchFamilies = async () => {
      if (selectedSubCategoryId !== "" && selectedCategoryId!== "") {
        try {
          const response = await axios.get(
            `https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetFamiliaByIdSubCategoria?SubCategoriaID=${selectedSubCategoryId}`
          );
          console.log(
            "https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetSubCategoriaByIdCategoria?$CategoriaID={selectedCategoryId}"
          );
          console.log("Subcategories Response:", response.data.familias);
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
      if (selectedFamilyId !== "" && selectedCategoryId !== "" && selectedSubCategoryId !== "") {
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


  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };



  return (
    <Box sx={{ p: 2, mb: 4 }}>
      <TextField label="Buscar..." value={searchTerm} onChange={handleSearch} />
      <Box sx={{ mt: 2 }}>
        <Box  sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={12}>
              <Grid item xs={12} sm={6} md={10}>
                <InputLabel>Selecciona Categoría</InputLabel>
                <Select
                  fullWidth
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
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
                </Select>
              </Grid>

              <Grid item xs={12} sm={6} md={10}>
                <InputLabel>Selecciona Sub-Categoría</InputLabel>
                <Select
                  fullWidth
                  value={selectedSubCategoryId}
                  onChange={(e) => setSelectedSubCategoryId(e.target.value)}
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
                </Select>
              </Grid>
              <Grid item xs={12} sm={6} md={10}>
                  <InputLabel>Selecciona Familia </InputLabel>
                  <Select
                    fullWidth
                    value={selectedFamilyId}
                    onChange={(e) => setSelectedFamilyId(e.target.value)}
                    label="Selecciona Familia"
                  >
                    {families.map((family) => (
                      <MenuItem key={family.idFamilia} value={family.idFamilia}>
                        {family.descripcion}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID Sub-Familia</TableCell>
            <TableCell>Descripción</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {families.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2}>No hay sub-familias para mostrar</TableCell>
            </TableRow>
          ) : (
            subfamilies.map((subfamilies) => (
              <TableRow key={subfamilies.idSubFamilia}>
                <TableCell>{subfamilies.idSubFamilia}</TableCell>
                <TableCell>{subfamilies.descripcion}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Box>





  )
}

export default SearchListSubFamilias