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
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Editp2 from "../Productos/Editp2";

const ITEMS_PER_PAGE = 10;

const SearchListProducts = () => {
  const apiUrl = import.meta.env.VITE_URL_API2;
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageProducts, setPageProducts] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const setPageCount = (productCount) => {
    const totalPages = Math.ceil(productCount / ITEMS_PER_PAGE);
    setTotalPages(totalPages);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/ProductosTmp/GetProductos`);
        if (Array.isArray(response.data.productos)) {
          setProducts(response.data.productos);
          setFilteredProducts(response.data.productos);
          setPageCount(response.data.productos.length);
        }
        console.log("response productos",response.data.productos);
        
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [refresh]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const fetchProducts = async () => {
        try {
          const response = await axios.get(`${apiUrl}/ProductosTmp/GetProductos`);
          if (Array.isArray(response.data.productos)) {
            setProducts(response.data.productos);
          }
        } catch (error) {
          console.error("Error updating products:", error);
        }
      };

      fetchProducts();
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
    setPageCount(filtered.length);
  }, [searchTerm, products]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);
    setPageProducts(currentProducts);
  }, [currentPage, filteredProducts]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDelete = async (id) => {
    try {
      const updatedProducts = products.filter((p) => p.idProducto !== id);
      setProducts(updatedProducts);

      const response = await axios.delete(`${apiUrl}/ProductosTmp/DeleteProducto?id=${id}`);

      if (response.data.statusCode === 201) {
        setSnackbarMessage("Producto eliminado correctamente");
        setOpenSnackbar(true);
        setRefresh((prevRefresh) => !prevRefresh);
      } else {
        setSnackbarMessage("Error al eliminar el producto");
      }
    } catch (error) {
      setSnackbarMessage("Error al eliminar el producto");
      console.error("Error deleting product:", error);
    }
  };

  useEffect(() => {
    let timeout;
    if (openSnackbar) {
      timeout = setTimeout(() => {
        setOpenSnackbar(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [openSnackbar]);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setRefresh((prevRefresh) => !prevRefresh);
  };

  const handleOpenDialog = (product) => {
    setProductToDelete(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setProductToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      handleDelete(productToDelete.idProducto);
      handleCloseDialog();
    }
  };

  return (
    <Box sx={{ p: 2, mb: 4 }}>
      <div>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="Productos sin códigos" />
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
                <TableCell>Precios </TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Impuestos</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>No se encontraron productos</TableCell>
                </TableRow>
              ) : (
                pageProducts.map((product) => (
                  <TableRow key={product.idProducto}>
                    <TableCell>{product.idProducto}</TableCell>
                    <TableCell>
                      {product.nombre}
                      <br />
                      <span style={{ color: "purple" }}>Marca: </span>
                      {product.marca} <br />
                    </TableCell>
                    <TableCell>
                      <span style={{ color: "purple" }}>Categoría: </span>
                      {product.categoria} <br />
                      <span style={{ color: "purple" }}>SubCategoría: </span>
                      {product.subCategoria} <br />
                      <span style={{ color: "purple" }}>Familia: </span>
                      {product.familia} <br />
                      <span style={{ color: "purple" }}>SubFamilia: </span>
                      {product.subFamilia} <br />
                    </TableCell>
                    <TableCell>
                      <span style={{ color: "purple" }}>Precio Costo: </span>
                      {product.precioCosto} <br />
                      <span style={{ color: "purple" }}>Precio Venta: </span>
                      {product.precioVenta} <br />
                    </TableCell>
                    <TableCell>
                      <span style={{ color: "purple" }}>Stock Inicial: </span>
                      {product.stockInicial} <br />
                      <span style={{ color: "purple" }}>Stock Crítico: </span>
                      {product.stockCritico} <br />
                    </TableCell>
                    <TableCell>{product.impuesto}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(product)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleOpenDialog(product)}>
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
      {openEditModal && selectedProduct && (
        <Editp2
          product={selectedProduct}
          open={openEditModal}
          handleClose={handleCloseEditModal}
        />
      )}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{"Confirmar Eliminación"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar este producto?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Confirmar          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        message={snackbarMessage}
        onClose={() => setOpenSnackbar(false)}
      />
    </Box>
  );
};

export default SearchListProducts;
