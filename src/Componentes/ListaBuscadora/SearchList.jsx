/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState,useEffect } from "react";
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
 
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


const SearchList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [perPage, setPerPage] = useState(5);
  const [displayCount, setDisplayCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Define the currentPage state here
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://www.easyposdev.somee.com/Usuarios/GetAllUsuario"
        );
        console.log('API response:', response.data); 
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (Array.isArray(users)) {
      setFilteredUsers(
        users.filter((user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, users]);
  

  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / perPage);

  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const usersToDisplay = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    const startIndex = (pageNumber - 1) * perPage;
    const endIndex =
      pageNumber * perPage <= totalUsers ? pageNumber * perPage : totalUsers;
    setDisplayCount(endIndex - startIndex);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDelete = (userId) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const handleEdit = (userId) => {
    
    console.log("Edit user with ID:", userId);
  };

  return (
    <Box sx={{ p: 2, mb: 4, border: "4px" }}>
      {/* <h2>Displaying {displayCount} users</h2> */}
      <TextField
        label="Buscar..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <Table sx={{ border: "1px ", borderRadius: "8px" }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Usuario</TableCell>
            <TableCell>RUT</TableCell>

            <TableCell>Teléfono</TableCell>
            <TableCell>Crédito</TableCell>

            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usersToDisplay.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>No users found</TableCell>
            </TableRow>
          ) : (
            usersToDisplay.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>
                  <span style={{ color: "purple" }}>{user.name}</span>
                  <br />
                  <span>{user.correo}</span>
                </TableCell>
                <TableCell>{user.rut}</TableCell>

                <TableCell>{user.telefono}</TableCell>
                <TableCell>{user.credito}</TableCell>
                <TableCell>
                  <Button onClick={() => handleDelete(user.id)}>
                    <DeleteIcon />
                  </Button>
                  <Button onClick={() => handleEdit(user.id)}>
                    <EditIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {Array.from({ length: totalPages }, (_, index) => (
        <Button
          key={index}
          onClick={() => handlePageChange(index + 1)}
          disabled={currentPage === index + 1}
        >
          {index + 1}
        </Button>
      ))}
    </Box>
  );
};

export default SearchList;
