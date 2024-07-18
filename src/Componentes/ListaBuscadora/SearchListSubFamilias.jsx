/* eslint-disable react-hooks/exhaustive-deps */
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
  IconButton,
  Grid,
  Select,
  InputLabel,
  Pagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import EditarSubFamilia from "./EditarSubFamilia"; // Make sure to provide the correct path

const ITEMS_PER_PAGE = 10;

const SearchListSubFamilias = () => {
  const apiUrl = import.meta.env.VITE_URL_API2;

  const [searchTerm, setSearchTerm] = useState("");
  const [families, setFamilies] = useState([]);
  const [subfamilies, setSubFamilies] = useState([]);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [subcategories, setSubCategories] = useState([]);
  const [filteredSubFamilies, setFilteredSubFamilies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedFamilyId, setSelectedFamilyId] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editSubFamilyData, setEditSubFamilyData] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSubFamilies, setPageSubFamilies] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const setPageCount = (subFamiliesCount) => {
    setTotalPages(Math.ceil(subFamiliesCount / ITEMS_PER_PAGE));
  };

  const updatePageData = () => {
    setPageSubFamilies(
      filteredSubFamilies.slice(
        ITEMS_PER_PAGE * (currentPage - 1),
        ITEMS_PER_PAGE * currentPage
      )
    );
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    setTotalPages(Math.ceil(filteredSubFamilies.length / ITEMS_PER_PAGE));
  }, [filteredSubFamilies]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL_API2}/NivelMercadoLogicos/GetAllCategorias`
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
            `${import.meta.env.VITE_URL_API2}/NivelMercadoLogicos/GetSubCategoriaByIdCategoria?CategoriaID=${selectedCategoryId}`
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
            `${import.meta.env.VITE_URL_API2}/NivelMercadoLogicos/GetFamiliaByIdSubCategoria?SubCategoriaID=${selectedSubCategoryId}`
          );
          setFamilies(response.data.familias);
        } catch (error) {
          console.error("Error fetching families:", error);
        }
      }
    };

    fetchFamilies();
  }, [selectedSubCategoryId]);

  const fetchSubFamilies = async () => {
    if (selectedFamilyId !== "" && selectedCategoryId !== "" && selectedSubCategoryId !== "") {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL_API2}/NivelMercadoLogicos/GetSubFamiliaByIdFamilia?FamiliaID=${selectedFamilyId}`
        );
        setSubFamilies(response.data.subFamilias);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    }
  };
  
  useEffect(() => {
    fetchSubFamilies(); // Initial fetch of sub-families
  }, [selectedFamilyId, selectedCategoryId, selectedSubCategoryId, refresh]);

  useEffect(() => {
    setFilteredSubFamilies(subfamilies);
    setPageCount(subfamilies.length);
    updatePageData();
  }, [subfamilies]);

  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    const filteredSubFamilies = subfamilies.filter((subfamily) =>
      subfamily.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSubFamilies(filteredSubFamilies);
    setPageCount(filteredSubFamilies.length);
    updatePageData();
  };

  const handleEdit = (subfamily) => {
    setEditSubFamilyData(subfamily);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setRefresh((prevRefresh) => !prevRefresh);
  };

  return (
    <Box sx={{ p: 2, mb: 4 }}>
      <TextField label="Buscar..." value={searchTerm} onChange={handleSearch} />
      <Box sx={{ mt: 2 }}>
        <Box sx={{ mt: 2 }}>
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
                <InputLabel>Selecciona Familia</InputLabel>
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
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pageSubFamilies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3}>
                No hay sub-familias para mostrar
              </TableCell>
            </TableRow>
          ) : (
            pageSubFamilies.map((subfamily) => (
              <TableRow key={subfamily.idSubFamilia}>
                <TableCell>{subfamily.idSubFamilia}</TableCell>
                <TableCell>{subfamily.descripcion}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(subfamily)}>
                    <EditIcon />
                  </IconButton>
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
      />

      {/* Render edit modal */}
      <EditarSubFamilia
        subfamily={editSubFamilyData}
        open={openEditModal}
        handleClose={handleCloseEditModal}
        fetchSubfamilies={fetchSubFamilies} // Pass the fetchSubFamilies function
      />
    </Box>
  );
};

export default SearchListSubFamilias;
