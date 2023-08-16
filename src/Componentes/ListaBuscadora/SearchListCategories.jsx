/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, TextField, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

const SearchListCategories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetAllCategorias");
        setCategories(response.data); // Update this line to use the response data directly
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (Array.isArray(categories)) {
      setFilteredCategories(
        categories.filter((category) =>
          category.descripcion && category.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, categories]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box sx={{ p: 2, mb: 4 }}>
      <TextField label="Buscar categoría..." value={searchTerm} onChange={handleSearch} />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID Categoría</TableCell>
            <TableCell>Descripción</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredCategories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2}>No se encontraron categorías</TableCell>
            </TableRow>
          ) : (
            filteredCategories.map((category) => (
              <TableRow key={category.idCategoria}>
                <TableCell>{category.idCategoria}</TableCell>
                <TableCell>{category.descripcion}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default SearchListCategories;
