/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Dialog from "@mui/material/Dialog";

import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import {
  Box,
  Typography,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Modal,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Paper from "@mui/material/Paper";

export const defaultTheme = createTheme();

const SearchList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [perPage, setPerPage] = useState(5);
  const [displayCount, setDisplayCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Define the currentPage state here
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [modalEditOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellido] = useState("");
  const [correo, setcorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [comuna, setComuna] = useState("");
  const [region, setRegion] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [rut, setRut] = useState("");
  const [codigoUsuario, setCodigoUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [remuneracion, setRemuneracion] = useState("");
  const [credito, setCredito] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://www.easyposdev.somee.com/Usuarios/GetAllUsuarios"
        );
        console.log("API response:", response.data);
        setUsers(response.data.usuarios);
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
          user.nombres.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleEdit = (user) => {
    setEditingUser(user);
    setNombres(user.nombres || "");
    setApellido(user.apellidos || "");
    setcorreo(user.correo || "");
    setTelefono(user.telefono || "");
    setDireccion(user.direccion || "");
    setComuna(user.comuna || "");
    setRegion(user.region || "");
    setCodigoPostal(user.codigoPostal || "");
    setRut(user.rut || "");
    setCodigoUsuario(user.codigoUsuario || "");
    setClave(user.clave || "");
    setRemuneracion(user.remuneracion || "");
    setCredito(user.credito || "");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleClose = () => {
    setModalOpen(false);
  };
  const setOpen = () => {
    setModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = {};

    //Validaciones
    if (!rut) {
      errors.rut = "Favor completar campo";
    } else if (
      !/^([1-9]|[1-9]\d|[1-9]\d{2})((\.\d{3})*|(\d{3})*)-(\d|k|K)$/.test(rut)
    ) {
      errors.rut = "Ingresa tu rut con puntos y guión";
    }

    if (!nombres) {
      errors.nombres = "Favor completar campo ";
    }
    if (!apellidos) {
      errors.apellidos = "Favor completar campo ";
    }
    if (!correo) {
      errors.correo = "Favor completar campo ";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,8}$/.test(correo)) {
      errors.correo = "Formato de correo no es válido";
    }
    if (!direccion) {
      errors.direccion = "Favor completar campo ";
    }
    if (!telefono) {
      errors.telefono = "Favor completar campo ";
    }
    if (!comuna) {
      errors.comuna = "Favor completar campo ";
    }
    if (!region) {
      errors.region = "Favor completar campo ";
    }
    if (!codigoPostal) {
      errors.codigoPostal = "Favor completar campo ";
    }
    if (!rut) {
      errors.rut = "Favor completar campo ";
    }
    if (!codigoUsuario) {
      errors.codigoUsuario = "Favor completar campo ";
    }
    if (!clave) {
      errors.clave = "Favor completar campo ";
    }
    if (!remuneracion) {
      errors.remuneracion = "Favor completar campo ";
    }
    if (!credito) {
      errors.credito = "Favor completar campo ";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    } else {
      const usuario = {
        nombres,
        apellidos,
        correo,
        direccion,
        telefono,
        comuna,
        region,
        codigoPostal,
        rut,
        codigoUsuario,
        clave,
        remuneracion,
        credito,
      };
      console.log(usuario);

      try {
        const response = await axios.post(
          "https://www.easyposdev.somee.com/Usuarios/AddUsuario",
          usuario
        );
        console.log(response.data.descripcion, "debugMiltoco");
        setModalContent({
          description: response.data.descripcion,
          positive: true,
        });
        setModalOpen(true);
      } catch (error) {
        console.log(error.response.data, "Leer Error");
        setModalContent({
          description: error.response.data.descripcion,
          positive: false,
        });
        setModalOpen(true);
      }
    }
  };

  return (
    <Box sx={{ p: 2, mb: 4, border: "4px" }}>
      {/* <h2>Displaying {displayCount} users</h2> */}
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
          {usersToDisplay.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>No se encontraron usuarios</TableCell>
            </TableRow>
          ) : (
            usersToDisplay.map((user) => (
              <TableRow key={user.codigoUsuario}>
                <TableCell>{user.codigoUsuario}</TableCell>
                <TableCell>
                  <span style={{ color: "purple" }}>{user.nombres}</span>
                  <br />
                  <span>{user.apellidos}</span>
                  <br />
                  <span>{user.correo}</span>
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

      <Modal open={modalEditOpen} onClose={handleClose}>
        <Box>
          {/* Display and edit the user data here */}
          {editingUser && (
            <ThemeProvider theme={defaultTheme}>
              <Grid
                container
                component="main"
                sx={{
                  height: "70vh",
                  width: "900px",
                  
                }}
              >
                <CssBaseline />

                <Grid
                  item
                  xs={12}
                  sm={8}
                  md={12}
                  component={Paper}
                  elevation={6}
                  square
                >
                  <Box
                    sx={{
                      my: 8,
                      mx: 4,

                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {" "}
                    <h2>Editar usuario</h2>
                    <Box
                      component="form"
                      noValidate
                      onSubmit={handleSubmit}
                      sx={{ mt: 1 }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            autoComplete="given-name"
                            name="nombres"
                            required
                            fullWidth
                            id="nombre"
                            label="Nombres"
                            error={!!errors.nombres} //!!Vacio o falso
                            helperText={errors.nombres}
                            value={editingUser.nombres}
                            onChange={(e) =>
                              setEditingUser({
                                ...editingUser,
                                nombres: e.target.value,
                              })
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            required
                            fullWidth
                            id="apellido"
                            label="Apellidos"
                            error={!!errors.apellidos} //!!Vacio o falso
                            helperText={errors.apellidos}
                            name="apellidos"
                            value={apellidos}
                            onChange={(e) => setApellido(e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            required
                            fullWidth
                            id="rut"
                            label="Ingrese rut"
                            name="rut"
                            value={rut}
                            onChange={(e) => setRut(e.target.value)}
                            error={!!errors.rut}
                            helperText={errors.rut}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  {rut &&
                                  /^([1-9]|[1-9]\d|[1-9]\d{2})((\.\d{3})*|(\d{3})*)-(\d|k|K)$/.test(
                                    rut
                                  ) ? (
                                    <Tooltip
                                      title="Correct rut format"
                                      placement="top"
                                    >
                                      <CheckCircleIcon
                                        style={{ color: "green" }}
                                      />
                                    </Tooltip>
                                  ) : null}
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            error={!!errors.correo}
                            helperText={errors.correo}
                            required
                            fullWidth
                            id="correo"
                            label="Correo Electrónico"
                            name="correo"
                            value={correo}
                            onChange={(e) => setcorreo(e.target.value)}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  {correo &&
                                  /^[\w-.]+@([\w-]+\.)+[\w-]{2,8}$/.test(
                                    correo
                                  ) ? (
                                    <Tooltip
                                      title="Correct rut format"
                                      placement="top"
                                    >
                                      <CheckCircleIcon
                                        style={{ color: "green" }}
                                      />
                                    </Tooltip>
                                  ) : null}
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            error={!!errors.telefono}
                            helperText={errors.telefono}
                            required
                            fullWidth
                            name="telefono"
                            label="Teléfono"
                            type="text"
                            id="telefono"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            error={!!errors.direccion}
                            helperText={errors.direccion}
                            required
                            fullWidth
                            name="direccion"
                            label="Dirección"
                            type="text"
                            id="direccion"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            error={!!errors.region}
                            helperText={errors.region}
                            required
                            fullWidth
                            name="region"
                            label="Región"
                            type="text"
                            id="region"
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            error={!!errors.comuna}
                            helperText={errors.comuna}
                            required
                            fullWidth
                            name="comuna"
                            label="Comuna"
                            type="text"
                            id="comuna"
                            value={comuna}
                            onChange={(e) => setComuna(e.target.value)}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            required
                            fullWidth
                            error={!!errors.codigoPostal}
                            helperText={errors.codigoPostal}
                            name="codigoPostal"
                            label="Código Postal"
                            type="text"
                            id="codigoPostal"
                            value={codigoPostal}
                            onChange={(e) => setCodigoPostal(e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <TextField
                            required
                            fullWidth
                            error={!!errors.codigoUsuario}
                            helperText={errors.codigoUsuario}
                            name="codigousuario"
                            label="Código Usuario"
                            type="text"
                            id="codigousuario"
                            value={codigoUsuario}
                            onChange={(e) => setCodigoUsuario(e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <TextField
                            error={!!errors.clave}
                            helperText={errors.clave}
                            required
                            fullWidth
                            name="clave"
                            label="Clave Usuario"
                            type="text"
                            id="clave"
                            value={clave}
                            onChange={(e) => setClave(e.target.value)}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            error={!!errors.remuneracion}
                            helperText={errors.remuneracion}
                            required
                            fullWidth
                            name="remuneracion"
                            label="Remuneración"
                            type="text"
                            id="remuneracion"
                            value={remuneracion}
                            onChange={(e) => setRemuneracion(e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            error={!!errors.credito}
                            helperText={errors.credito}
                            required
                            fullWidth
                            name="credito"
                            label="Crédito"
                            type="text"
                            id="credito"
                            value={credito}
                            onChange={(e) => setCredito(e.target.value)}
                          />
                        </Grid>
                      </Grid>

                      <Button
                        type="submit"
                        size="md"
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                      >
                        guardar usuario
                      </Button>

                      <Grid container></Grid>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </ThemeProvider>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default SearchList;
