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
  Tabs,
  Tab,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
// import EditarCategoria from "./EditarCategoria";

const ITEMS_PER_PAGE = 10;
const SearchListProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [product, setproduct] = useState([]);
  const [filteredproduct, setFilteredproduct] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageproduct, setPageproduct] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editproductData, setEditproductData] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const setPageCount = (productCount) => {
    const totalPages = Math.ceil(productCount / ITEMS_PER_PAGE);
    if (!isNaN(totalPages)) {
      setTotalPages(totalPages);
    } else {
      console.error("Invalid product count:", productCount);
    }
  };

  const updatePageData = () => {
    setPageproduct(
      filteredproduct.slice(
        ITEMS_PER_PAGE * (currentPage - 1),
        ITEMS_PER_PAGE * currentPage
      )
    );
  };

  useEffect(() => {
    const fetchproduct = async () => {
      try {
        const response = await axios.get(
          "https://www.easyposdev.somee.com/api/ProductosTmp/GetProductos"
        );
        console.log("API Response:", response.data.productos);
        if (Array.isArray(response.data.productos)) {
          setproduct(response.data.productos);
          setPageCount(response.data.cantidadRegistros);
          setPageproduct(response.data.productos);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchproduct();
  }, [refresh]);

  useEffect(() => {
    if (Array.isArray(product)) {
      setFilteredproduct(
        product.filter(
          (product) =>
            product.descripcion &&
            product.descripcion
              .trim()
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, product]);

  // useEffect(() => {
  //   updatePageData();
  // }, [searchTerm, product, currentPage, filteredproduct]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  //
  useEffect(() => {
    const totalPages = Math.ceil(filteredproduct.length / ITEMS_PER_PAGE);
    if (!isNaN(totalPages)) {
      setTotalPages(totalPages);
    } else {
      console.error("Invalid filtered product length:", filteredproduct.length);
    }
  }, [filteredproduct]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    console.log(`Delete item with id ${id}`);
    // Write your delete handling logic here...
  };

  const handleEdit = (product) => {
    setEditproductData(product, product.descripcion);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setRefresh((prevRefresh) => !prevRefresh); // Toggle refresh
  };

  return (
    <Box sx={{ p: 2, mb: 4 }}>
      <div>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="Productos sin codigos" />
          <Tab label="Productos con codigos" />
        </Tabs>
        <div style={{ p: 2, mt: 4 }} role="tabpanel" hidden={selectedTab !== 0}>
          <TextField
            margin="dense"
            label="Buscar productos..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID Productos </TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Mercado Lógico</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageproduct.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2}>No se encontraron productos</TableCell>
                </TableRow>
              ) : (
                pageproduct.map((product) => (
                  <TableRow key={product.idProducto}>
                    <TableCell>{product.idProducto}</TableCell>
                    <TableCell>{product.nombre}</TableCell>

                    <TableCell>
                      <span style={{ color: "purple" }}>Categoría: </span>
                      {product.categoria} <br></br>
                      <span style={{ color: "purple" }}>SubCategoría: </span>
                      {product.subCategoria} <br></br>
                      <span style={{ color: "purple" }}>Familia: </span>
                      {product.familia} <br></br>
                      <span style={{ color: "purple" }}>SubFamilia: </span>
                      {product.subFamilia} <br></br>
                    </TableCell>

                    <TableCell>{product.descripcion}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(product)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(product.idProducto)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div role="tabpanel" hidden={selectedTab !== 1}>
          <TextField
            margin="dense"
            label="Buscar productos..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID Productos Con Codigos</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody key={product.idProducto}>
              {pageproduct.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2}>No se encontraron productos</TableCell>
                </TableRow>
              ) : (
                pageproduct.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.nombre}</TableCell>
                    <TableCell>{product.descripcion}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(product)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(product.idProducto)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        showFirstButton
        showLastButton
      />
      {/* ModalEditar */}
      {/* <EditarCategoria
        product={editproductData}
        open={openEditModal}
        handleClose={handleCloseEditModal}
      /> */}
    </Box>
  );
};

export default SearchListProducts;
