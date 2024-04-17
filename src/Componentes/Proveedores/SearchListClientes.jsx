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
import EditarCliente from "../Proveedores/EditarClientes"

const ITEMS_PER_PAGE = 10;

const SearchListClientes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editClienteData, setEditClienteData] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditSuccessful, setIsEditSuccessful] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    async function fetchClientes() {
      try {
        const response = await axios.get(
          "https://www.easyposdev.somee.com/api/clientes/GetAllClientes"
        );
        console.log("API response:", response.data);
        setClientes(response.data.cliente);
        setFilteredClientes(
          response.data.cliente.slice(0, ITEMS_PER_PAGE)
        );
        setPageCount(response.data.cliente.length);
      } catch (error) {
        console.log(error);
      }
    }

    fetchClientes();
  }, [refresh]);

  const setPageCount = (clientesCount) => {
    setTotalPages(Math.ceil(clientesCount / ITEMS_PER_PAGE));
  };

  useEffect(() => {
    if (isEditSuccessful) {
      setOpenEditModal(false); // Close the modal on successful edit
      setIsEditSuccessful(false); // Reset success state
      setRefresh(!refresh); // Trigger data refresh
    }
  }, [isEditSuccessful]);

  const handleEdit = (cliente) => {
    setEditClienteData(cliente);
    setOpenEditModal(true);
    setIsEditSuccessful(false);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    const filtered = clientes.filter((cliente) =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClientes(filtered.slice(
      ITEMS_PER_PAGE * (currentPage - 1),
      ITEMS_PER_PAGE * currentPage
    ));
  }, [clientes, searchTerm, currentPage]);

  const onEditSuccess = () => {
    setIsEditSuccessful(true);
  };

  return (
    <Box sx={{ p: 2, mb: 4 }}>
      <div>
        <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)}>
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
                <TableCell>ID </TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Giro</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClientes.map((cliente) => (
                <TableRow key={cliente.codigoCliente}>
                  <TableCell>{cliente.codigoCliente}</TableCell>
                  <TableCell>{cliente.nombre}<br />{cliente.rut}<br /> <span style={{ color: "purple" }}>Tel:{cliente.telefono}</span> </TableCell>
                  <TableCell>{cliente.giro}</TableCell>
                  <TableCell>{cliente.direccion}<br />{cliente.comuna}<br /> {cliente.region}</TableCell>
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
      <EditarCliente
        open={openEditModal}
        handleClose={handleCloseEditModal}
        cliente={editClienteData}
        onEditSuccess={onEditSuccess}
      />
    </Box>
  );
};

export default SearchListClientes;
