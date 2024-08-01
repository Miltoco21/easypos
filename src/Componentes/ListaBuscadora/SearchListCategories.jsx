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
  IconButton,
  Pagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditarCategoria from "./EditarCategoria";

const ITEMS_PER_PAGE = 10;
const SearchListCategories = () => {
  const apiUrl = import.meta.env.VITE_URL_API2;
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageCategories, setPageCategories] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editCategoryData, setEditCategoryData] = useState({});
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL_API2}/NivelMercadoLogicos/GetAllCategorias`
        );
        console.log("API Response:", response.data.categorias);
        setCategories(response.data.categorias);
        setPageCount(response.data.categorias.length);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
  
    fetchCategories();
  }, [refresh]);

  useEffect(() => {
    const updateCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL_API2}/NivelMercadoLogicos/GetAllCategorias`
        );
        
        if (Array.isArray(response.data.categorias)) {
          setCategories(response.data.categorias);
        }
        // console.log(response.data.categorias);
      } catch (error) {
        console.error("Error updating products:", error);
      }
    };

    const intervalId = setInterval( updateCategories, 3000); // Actualizar cada 3 segundos

    return () => clearInterval(intervalId); // Limpiar intervalo cuando el componente se desmonta
  }, []);



  useEffect(() => {
    setFilteredCategories(
      categories.filter(
        (category) =>
          category.descripcion &&
          category.descripcion
            .trim()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, categories]);

  useEffect(() => {
    updatePageData();
  }, [searchTerm, categories, currentPage, filteredCategories]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  //
  useEffect(() => {
    setTotalPages(Math.ceil(filteredCategories.length / ITEMS_PER_PAGE));
  }, [filteredCategories]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    console.log(`Delete item with id ${id}`);
    // Write your delete handling logic here...
  };

  const handleEdit = (category) => {
    setEditCategoryData(category,category.descripcion)
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setRefresh((prevRefresh) => !prevRefresh); // Toggle refresh
  };

  return (
    <Box sx={{ p: 2, mb: 4 }}>
      <TextField
        label="Buscar categoría..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID Categoría</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pageCategories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2}>No se encontraron categorías</TableCell>
            </TableRow>
          ) : (
            pageCategories.map((category) => (
              <TableRow key={category.idCategoria}>
                <TableCell>{category.idCategoria}</TableCell>
                <TableCell>{category.descripcion.trim()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(category)}>
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
      <EditarCategoria
        category={editCategoryData}
        open={openEditModal}
        handleClose={handleCloseEditModal}
      />
    </Box>
  );
};

export default SearchListCategories;
