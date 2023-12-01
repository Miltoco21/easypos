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
import Editp2 from "../Productos/Editp2";

const ITEMS_PER_PAGE = 10;
const SearchListProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [product, setProduct] = useState([]);
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageProduct, setPageProduct] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [refresh, setRefresh] = useState(false);

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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          "https://www.easyposdev.somee.com/api/ProductosTmp/GetProductos"
        );
        console.log("API Response:", response.data);
        if (Array.isArray(response.data.productos)) {
          setProduct(response.data.productos);
          setPageCount(response.data.cantidadRegistros);
          setPageProduct(response.data.productos);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, []);

  useEffect(() => {
    if (Array.isArray(product)) {
      setFilteredProduct(
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

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    const totalPages = Math.ceil(filteredProduct.length / ITEMS_PER_PAGE);
    if (!isNaN(totalPages)) {
      setTotalPages(totalPages);
    } else {
      console.error("Invalid filtered product length:", filteredProduct.length);
    }
  }, [filteredProduct]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    console.log(`Delete item with id ${id}`);
    // Write your delete handling logic here...
  };

  const handleEdit = (product) => {
    console.log("Edit button pressed for product:", product);

    setSelectedProduct(product);
    console.log("selected prod", selectedProduct);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setRefresh((prevRefresh) => !prevRefresh);

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
                <TableCell>Precios </TableCell>

                <TableCell>Stock</TableCell>
                <TableCell>Impuestos</TableCell>
                <TableCell>Bodega</TableCell>
                <TableCell>Proveedor</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageProduct.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2}>No se encontraron productos</TableCell>
                </TableRow>
              ) : (
                pageProduct.map((product) => (
                  <TableRow key={product.idProducto}>
                    <TableCell>{product.idProducto}</TableCell>
                    <TableCell>{product.nombre}<br></br>
                    <span style={{ color: "purple" }}>Marca: </span>
                      {product.marca} <br></br>
                    </TableCell>

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

                    <TableCell>
                      <span style={{ color: "purple" }}>Precio Costo: </span>
                      {product.precioCosto} <br></br>
                      <span style={{ color: "purple" }}>Precio Venta: </span>
                      {product.precioVenta} <br></br>
                    </TableCell>

                    <TableCell>
                      {" "}
                      <span style={{ color: "purple" }}>Stock Inical: </span>
                      {product.stockInicial} <br></br>
                      <span style={{ color: "purple" }}>Stock Crítico: </span>
                      {product.stockCritico} <br></br>
                    </TableCell>
                    <TableCell>{product.impuesto}</TableCell>
                    <TableCell>{product.bodega}</TableCell>
                <TableCell>{product.proveedor}</TableCell>
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
            <TableBody>
              {pageProduct.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2}>No se encontraron productos</TableCell>
                </TableRow>
              ) : (
                pageProduct.map((product) => (
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
      {openEditModal && selectedProduct && (
        <Editp2
          product={selectedProduct}
          open={openEditModal}
          handleClose={handleCloseEditModal}
        />
      )}
    </Box>
  );
};

export default SearchListProducts;
