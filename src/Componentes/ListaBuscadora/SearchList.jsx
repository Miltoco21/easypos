import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, TextField, Table, TableBody, TableCell, TableHead, TableRow, Button, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditUsuario from "./EditUsuario";

const SearchList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [modalEditOpen, setModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const perPage = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://www.easyposdev.somee.com/api/Usuarios/GetAllUsuarios");
        console.log("API response:", response.data);
        setUsers(response.data.usuarios);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [refresh]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`https://www.easyposdev.somee.com/api/Usuarios/DeleteUsuario/${userId}`);
      setRefresh(!refresh); // Refresh the users list after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setModalOpen(false);
    setRefresh(!refresh); // Refresh the users list after editing
  };

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.nombres.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredUsers.length / perPage);

  return (
    <Box sx={{ p: 2, mb: 4, border: "4px" }}>
      <TextField label="Buscar..." value={searchTerm} onChange={handleSearch} />
      <Table sx={{ border: "1px ", borderRadius: "8px" }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Usuario</TableCell>
            <TableCell>RUT</TableCell>
            <TableCell>Dirección</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell>Crédito</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>No se encontraron usuarios</TableCell>
            </TableRow>
          ) : (
            paginatedUsers.map((user) => (
              <TableRow key={user.codigoUsuario}>
                <TableCell>{user.codigoUsuario}</TableCell>
                <TableCell>
                  <span style={{ color: "purple" }}>{user.nombres}</span>
                  <br />
                  <span>{user.apellidos}</span>
                  <br />
                  <span>{user.correo}</span>
                  <br />
                  <span>Rol: {user.rol}</span>
                </TableCell>
                <TableCell>{user.rut}</TableCell>
                <TableCell>
                  {user.direccion}
                  <br />
                  {user.comuna}
                  <br />
                  {user.region}
                </TableCell>
                <TableCell>{user.telefono}</TableCell>
                <TableCell>{user.credito}</TableCell>
                <TableCell>
                  <Button onClick={() => handleDelete(user.codigoUsuario)}>
                    <DeleteIcon />
                  </Button>
                  <Button onClick={() => handleEdit(user)}>
                    <EditIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
        <Typography variant="body2">
          Página {currentPage} de {totalPages}
        </Typography>
        <Box>
          <Button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Anterior
          </Button>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Siguiente
          </Button>
        </Box>
      </Box>
      <EditUsuario 
        selectedUser={selectedUser}
        open={modalEditOpen}
        handleCloseEditModal={handleCloseEditModal}
      />
    </Box>
  );
};

export default SearchList;
