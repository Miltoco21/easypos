/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, TextField, Table, TableBody, TableCell, TableHead, TableRow,Pagination } from "@mui/material";


const ITEMS_PER_PAGE = 10;
const SearchListCategories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageCategories, setPageCategories] = useState([]);

  const setPageCount = (categoriesCount) => {
    setTotalPages(Math.ceil(categoriesCount / ITEMS_PER_PAGE));
  };

  const updatePageData = () => {
    setPageCategories(categories.slice(ITEMS_PER_PAGE * (currentPage - 1), ITEMS_PER_PAGE * currentPage));
  };


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetAllCategorias");
        console.log("API Response:", response.data.categorias);
        setCategories(response.data.categorias);
        setPageCount(response.data.categorias.length);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
  
    fetchCategories();
  }, []);

  useEffect(() => {
    updatePageData();
  }, [searchTerm, categories, currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };


  

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredCategories(categories.slice(ITEMS_PER_PAGE * (currentPage - 1), ITEMS_PER_PAGE * currentPage)); // Apply pagination to categories
    } else if (searchTerm.trim() !== "" && Array.isArray(categories)) {
      const filteredData = categories.filter((category) =>
        category.descripcion && category.descripcion.trim().toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filteredData);
    }
  }, [searchTerm, categories, currentPage]);

  
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filteredData = categories.filter((category) =>
        category.descripcion && category.descripcion.trim().toLowerCase().includes(searchTerm.toLowerCase())
    );
    setPageCategories(filteredData);
    setPageCount(filteredData.length);
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
                <TableCell>{category.descripcion.trim()}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
       
      </Table>
      <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} showFirstButton showLastButton/>
    </Box>
  );
};

export default SearchListCategories;
