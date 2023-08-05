/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
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

  const filteredUsers = [
    {
      id: 1,
      name: "User 1",
      rut: "13.686.677-2",
      correo: "example@gmail.com",
      telefono: "5532755",
      direccion: "evergreen 235",
      credito: "",
    },
    { id: 2, name: "User 2" },
    { id: 3, name: "User 3" },
    { id: 4, name: "User 4" },
    { id: 5, name: "User 5" },
    { id: 6, name: "User 6" },
    { id: 7, name: "User 7" },
    { id: 8, name: "User 8" },
    { id: 9, name: "User 9" },
    { id: 10, name: "User 10" },
    { id: 11, name: "User 11" },
    { id: 12, name: "User 12" },
    { id: 13, name: "User 13" },
    { id: 14, name: "User 14" },
    { id: 15, name: "User 15" },
    { id: 16, name: "User 16" },
    { id: 17, name: "User 17" },
    { id: 18, name: "User 18" },
    { id: 19, name: "User 19" },
    { id: 20, name: "User 20" },
  ];

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
    // Implement edit functionality
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
          {usersToDisplay.map((user) => (
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
                <Button onClick={() => handleDelete(user.id)}><DeleteIcon/></Button>
                <Button onClick={() => handleEdit(user.id)}><EditIcon/></Button>
              </TableCell>
            </TableRow>
          ))}
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
