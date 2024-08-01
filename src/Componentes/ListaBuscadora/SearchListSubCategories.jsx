/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, TextField, Table,IconButton, TableBody,Pagination, TableCell, TableHead, TableRow,MenuItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditarSubCategoria from "./EditarSubcategoria";


const ITEMS_PER_PAGE = 10;
const SearchListSubCategories = () => {

  const apiUrl = import.meta.env.VITE_URL_API2;

  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [subcategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [editSubCategoryData, setEditSubCategoryData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageCategories, setPageCategories] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
 
  const [refresh, setRefresh] = useState(false);

  const setPageCount = (categoriesCount) => {
    setTotalPages(Math.ceil(categoriesCount / ITEMS_PER_PAGE));
  };

  const updatePageData = () => {
    setPageCategories(
      filteredCategories.slice(
        ITEMS_PER_PAGE * (currentPage - 1),
        ITEMS_PER_PAGE * currentPage
      )
    );
  };
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  

  //
  useEffect(() => {
    setTotalPages(Math.ceil(filteredSubCategories.length / ITEMS_PER_PAGE));
  }, [filteredSubCategories]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL_API2}/NivelMercadoLogicos/GetAllCategorias`);
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
          const response = await axios.get(`${import.meta.env.VITE_URL_API2}/NivelMercadoLogicos/GetSubCategoriaByIdCategoria?CategoriaID=${selectedCategoryId}`);
          console.log(`${apiUrl}/NivelMercadoLogicos/GetSubCategoriaByIdCategoria?$CategoriaID=${selectedCategoryId}`);
          console.log("Subcategories Response:", response.data.subCategorias);
          setSubCategories(response.data.subCategorias);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      }
    };
  
    fetchSubCategories();
  }, [selectedCategoryId,refresh]);

  useEffect(() => {
    if (Array.isArray(subcategories)) {
      setFilteredSubCategories(
        subcategories.filter((subcategory) =>
        subcategory.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
          // subcategory.descripcion && subcategory.descripcion.trim().toLowerCase().includes(searchTerm.toLowerCase())
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
  const handleEdit = (subcategory) => {
    setEditSubCategoryData(subcategory,subcategory.descripcion)
    setOpenEditModal(true);
  };
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setRefresh((prevRefresh) => !prevRefresh); // Toggle refresh
  };

  return (
    <Box sx={{ p: 2, mb: 4 }}>
      <TextField label="Buscar..." value={searchTerm} onChange={handleSearch} />
      <Box sx={{ mt: 2 }}>
        <TextField
          select
          label="Selecciona Categoría"
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
            <TableCell>ID Sub-Categoría</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredSubCategories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2}>No hay subcategorias para mostrar</TableCell>
            </TableRow>
          ) : (
            filteredSubCategories.map((subcategory) => (
              <TableRow key={subcategory.idSubcategoria}>
                <TableCell>{subcategory.idSubcategoria}</TableCell>
                <TableCell>{subcategory.descripcion}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(subcategory)}>
                    <EditIcon />
                  </IconButton>
                  {/* <IconButton
                    onClick={() => handleDelete(category.idCategoria)}
                  >
                    <DeleteIcon />
                  </IconButton> */}
                </TableCell>
              </TableRow>


              

            ))
          )}
        </TableBody>
      </Table>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        showFirstButton
        showLastButton
      />
        {/* ModalEditar */}
      <EditarSubCategoria
        subcategory={editSubCategoryData}
        open={openEditModal}
        handleClose={handleCloseEditModal}
        
      />
    </Box>
  );
};

export default SearchListSubCategories;









