/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
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
  Tabs,
  Tab,
  Pagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditarProveedor from "./EditarProveedor"; // Assuming you have this component

const ITEMS_PER_PAGE = 10;

const SearchListProveedores = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [proveedores, setProveedores] = useState([]);
  const [filteredProveedores, setFilteredProveedores] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editProveedorData, setEditProveedorData] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditSuccessful, setIsEditSuccessful] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    if (proveedores) {
      setTotalPages(Math.ceil(proveedores.length / ITEMS_PER_PAGE));
    }
  }, [proveedores]);

  useEffect(() => {
    async function fetchProveedores() {
      try {
        const response = await axios.get(
          "https://www.easyposdev.somee.com/api/Proveedores/GetAllProveedores"
        );
        console.log("API response:", response.data.proveedores);
        setProveedores(response.data.proveedores);
        setFilteredProveedores(
          response.data.proveedores.slice(0, ITEMS_PER_PAGE)
        );
        setPageCount(response.data.proveedores.length);
      } catch (error) {
        console.log(error);
      }
    }

    fetchProveedores();
  }, [refresh]);

  useEffect(() => {
    setProveedores(); // Initial fetch of sub-families
  }, [refresh]);

  // useEffect(() => {
  //   if (isEditSuccessful) {
  //     setOpenEditModal(false); // Close the modal on successful edit
  //   }
  // }, [isEditSuccessful]);

  const handleEdit = (proveedor) => {
    setEditProveedorData(proveedor);
    setOpenEditModal(true);
    setIsEditSuccessful(false);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setRefresh((prevRefresh) => !prevRefresh);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filteredItems = proveedores.filter((proveedor) =>
      proveedor.nombre.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredProveedores(filteredItems.slice(0, ITEMS_PER_PAGE));
    setTotalPages(Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
    setCurrentPage(1);
  };
  const setPageCount = (proveedoresCount) => {
    setTotalPages(Math.ceil(proveedoresCount / ITEMS_PER_PAGE));
  };
  const updatePageData = () => {
    if (proveedores) {
      setFilteredProveedores(
        proveedores.slice(
          ITEMS_PER_PAGE * (currentPage - 1),
          ITEMS_PER_PAGE * currentPage
        )
      );
    }
  };
  useEffect(() => {
    updatePageData();
  }, [proveedores,searchTerm,currentPage,filteredProveedores]);

  useEffect(() => {
    if (isEditSuccessful) {
      setOpenEditModal(false); // Close the modal on successful edit
      setIsEditSuccessful(false); // Reset success state
    }
  }, [isEditSuccessful]);

  const onEditSuccess = () => {
    setIsEditSuccessful(true);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box sx={{ p: 2, mb: 4 }}>
      <div>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="Proovedores" />
          <Tab label="Clientes" />
        </Tabs>
        <div style={{ p: 2, mt: 4 }} role="tabpanel" hidden={selectedTab !== 0}>
          <TextField
            label="Buscar..."
            value={searchTerm}
            onChange={handleSearch}
            margin="dense"
          />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID Proveedor</TableCell>
                <TableCell>Razón Social</TableCell>

                <TableCell>Responsable</TableCell>
                <TableCell>Sucursal</TableCell>
                <TableCell>Forma de pago</TableCell>
                <TableCell>Página</TableCell>

                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {proveedores?.map((proveedor) => (
                <TableRow key={proveedor.codigoProveedor}>
                  <TableCell>{proveedor.codigoProveedor}</TableCell>
                  <TableCell>
                    {proveedor.razonSocial} <br />
                    <span style={{ color: "purple" }}>{proveedor.email}</span>
                    {proveedor.correo}
                    <br />
                    {proveedor.rut}
                  </TableCell>

                  <TableCell>
                    {proveedor.nombreResponsable}
                    <br />
                    {proveedor.correoResponsable}
                    <br />
                    {proveedor.telefonoResponsable}
                    <br />
                  </TableCell>
                  <TableCell>
                    {proveedor.sucursal}
                    <br />
                    {proveedor.direccion}
                    <br />
                    {proveedor.comuna}
                    <br />
                  </TableCell>
                  <TableCell>{proveedor.formaPago}</TableCell>
                  <TableCell>{proveedor.pagina}</TableCell>

                  <TableCell>
                    <IconButton onClick={() => handleEdit(proveedor)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div style={{ p: 2, mt: 4 }} role="tabpanel" hidden={selectedTab !== 1}>
          <TextField
            label="Buscar..."
            value={searchTerm}
            onChange={handleSearch}
            margin="dense"
          />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID Cliente</TableCell>
                <TableCell>Razón Social</TableCell>

                <TableCell>Responsable</TableCell>
                <TableCell>Sucursal</TableCell>
                <TableCell>Forma de pago</TableCell>
                <TableCell>Página</TableCell>

                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {proveedores?.map((cliente) => (
                <TableRow key={cliente.codigoProveedor}>
                  <TableCell>{cliente.codigoProveedor}</TableCell>
                  <TableCell>
                    {cliente.razonSocial} <br />
                    <span style={{ color: "purple" }}>{cliente.email}</span>
                    {cliente.correo}
                    <br />
                    {cliente.rut}
                  </TableCell>

                  <TableCell>
                    {cliente.nombreResponsable}
                    <br />
                    {cliente.correoResponsable}
                    <br />
                    {cliente.telefonoResponsable}
                    <br />
                  </TableCell>
                  <TableCell>
                    {cliente.sucursal}
                    <br />
                    {cliente.direccion}
                    <br />
                    {cliente.comuna}
                    <br />
                  </TableCell>
                  <TableCell>{cliente.formaPago}</TableCell>
                  <TableCell>{cliente.pagina}</TableCell>

                  <TableCell>
                    <IconButton onClick={() => handleEdit(cliente)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Box sx={{ mt: 2 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          showFirstButton
          showLastButton
        />
      </Box>
      <EditarProveedor
        open={openEditModal}
        handleClose={handleCloseEditModal}
        proveedor={editProveedorData}
        fetchProveedores={setProveedores}
        onEditSuccess={() => setIsEditSuccessful(true)} // New addition
      />
    </Box>
  );
};

export default SearchListProveedores;

