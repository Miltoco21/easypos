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
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditUsuario from "./EditUsuario";
import PaymentsIcon from "@mui/icons-material/Payments";
import SideBar from "../NavBar/SideBar"

const SearchList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [modalEditOpen, setModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState("");
  const perPage = 5;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const apiUrl = import.meta.env.VITE_URL_API2;
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_API2}/Usuarios/GetAllUsuarios`
      );
      // console.log("API response:", response.data);
      setUsers(response.data.usuarios);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [refresh]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchUsers();
    }, 3000); // Fetch users every 3 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteConfirmationOpen = (user) => {
    setUserToDelete(user);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmationClose = () => {
    setUserToDelete(null);
    setDeleteConfirmationOpen(false);
  };
  const handleDelete = async () => {
    if (!userToDelete) return; // Verificar si hay un usuario seleccionado para eliminar
    const userId = userToDelete.codigoUsuario;
    console.log("ID de usuario a eliminar:", userId);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_URL_API2}/Usuarios/DeleteUsuarioByCodigo?CodigoUsuario=${userId}`
      );

      if (
        response.status === 200 &&
        response.data.descripcion === "Usuario Eliminado."
      ) {
        console.log("Usuario eliminado exitosamente:", response.data);
        setRefresh(!refresh); // Refresh the users list after deletion
        setDeleteConfirmationOpen(false); // Cerrar el diálogo de confirmación después de eliminar
        setSnackbarMessage("Usuario eliminado exitosamente.");
        setSnackbarOpen(true);
      } else {
        console.error(
          "Error inesperado en la respuesta de eliminación:",
          response.data
        );
        setSnackbarMessage("Error inesperado al eliminar usuario.");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      setSnackbarMessage("Error eliminando usuario.");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
      <SideBar/>

       <Snackbar
          open={snackbarOpen}
          autoHideDuration={16000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
        
          action={
            <Button color="inherit" size="small" onClick={handleSnackbarClose}>
              Cerrar
            </Button>
          }
        />
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
                  <Button onClick={() => handleDeleteConfirmationOpen(user)}>
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
        }}
      >
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmationOpen}
        onClose={handleDeleteConfirmationClose}
        aria-labelledby="delete-confirmation-dialog-title"
      >
        <DialogTitle id="delete-confirmation-dialog-title">
          Confirmación de eliminación
        </DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar este usuario?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmationClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SearchList;
