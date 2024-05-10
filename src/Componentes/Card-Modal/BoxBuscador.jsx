import React, { useState, useEffect } from "react";
import {
  Paper,
  Grid,
  Button,
  TextField,
  ListItem,
  Chip,
  Typography,
  Snackbar,
  InputLabel,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert,
  TablePagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";

const BoxBuscador = ({ onClosePreciosClientes }) => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editedPrices, setEditedPrices] = useState("");
  const [productSearchText, setProductSearchText] = useState(""); // Estado para el texto de búsqueda de productos
  const [filteredProducts, setFilteredProducts] = useState([]); // Estado para almacenar los productos filtrados
  const [page, setPage] = useState(0); // Estado para el número de página actual
  const rowsPerPage = 10; // Número de filas por página (estático)
  const [preciosModificados, setPreciosModificados] = useState({});
  const [loadingProduct, setLoadingProduct] = useState(null); // Estado para manejar el estado de carga de cada producto
  const [selectedItem, setSelectedItem] = useState(null);

  const codigoCliente = selectedClient ? selectedClient.codigoCliente : null;
  const codigoClienteSucursal = selectedClient
    ? selectedClient.codigoClienteSucursal
    : null;

  const handleChipClick = async (result) => {
    setSelectedResult(result);
    setSelectedClient(result);
    setSearchResults([]);

    try {
      const response = await axios.get(
        `https://www.easyposdev.somee.com/api/Clientes/GetClientesProductoPrecioByIdCliente?codigoCliente=${result.codigoCliente}&codigoClienteSucursal=${result.codigoClienteSucursal}`
      );
      console.log(
        "Productos obtenidos:",
        response.data.clientesProductoPrecioMostrar
      );
      setProducts(response.data.clientesProductoPrecioMostrar);
    } catch (error) {
      console.error("Error fetching products by client:", error);
    }
  };

  const handleSearch = async () => {
    setSelectedClient("");
    if (searchText.trim() === "") {
      setSnackbarMessage("El campo de búsqueda está vacío");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.get(
        `https://www.easyposdev.somee.com/api/Clientes/GetClientesByNombreApellido?nombreApellido=${searchText}`
      );
      if (
        Array.isArray(response.data.clienteSucursal) &&
        response.data.clienteSucursal.length > 0
      ) {
        setSearchResults(response.data.clienteSucursal);
        setSnackbarMessage("Resultados encontrados");
      } else {
        setSearchResults([]);
        setSnackbarMessage("No se encontraron resultados");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setSearchResults([]);
      setSnackbarMessage("Error al buscar");
    }
    setSnackbarOpen(true);
  };

  const handleProductSearchChange = (e) => {
    setProductSearchText(e.target.value);
  };

  useEffect(() => {
    // Filtrar la lista de productos según el texto de búsqueda
    const filtered = products.filter((product) =>
      product.nombre.toLowerCase().includes(productSearchText.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [productSearchText, products]);

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
    if (e.target.value.trim() === "") {
      setSearchResults([]); // Limpiar los resultados de búsqueda cuando el campo de búsqueda esté vacío
    }
  };

  const handleKeyDown = (event, field) => {
    if (field === "marca") {
      const regex = /^[a-zA-Z]*$/;
      if (!regex.test(event.key) && event.key !== "Backspace") {
        event.preventDefault();
      }
    }
    if (field === "nombre") {
      const regex = /^[a-zA-Z]*$/;
      if (!regex.test(event.key) && event.key !== "Backspace") {
        event.preventDefault();
      }
    }
    if (field === "precio") {
      // Validar si la tecla presionada es un signo menos
      if (!/^\d+$/.test(event.key) && event.key !== "Backspace") {
        event.preventDefault();
      }
    }
  };

  const handlePrecioChange = (e, itemId) => {
    const updatedPrices = {
      ...preciosModificados,
      [itemId]: e.target.value.trim() !== "" ? parseFloat(e.target.value) : "",
    };
    setPreciosModificados(updatedPrices);
  };

  const handleSaveChanges = async (
    idProducto,
    codigoCliente,
    codigoClienteSucursal
  ) => {
    try {
      setLoadingProduct(idProducto); // Establecer el estado de carga solo para el producto actual

      const requestBody = {
        codigoCliente: codigoCliente,
        codigoClienteSucursal: codigoClienteSucursal,
        preciosProductos: [
          {
            idProducto: parseInt(idProducto),
            precio: preciosModificados[idProducto],
          },
        ],
      };

      const response = await axios.put(
        "https://www.easyposdev.somee.com/api/Clientes/PutClientesProductoActualizarPrecioByIdCliente",
        requestBody
      );

      if (response.status === 200) {
        // Restablecer el estado de carga después de un tiempo de espera
        setTimeout(() => {
          setLoadingProduct(null);
        }, 3000); // Tiempo extendido de espera en milisegundos (en este caso, 3000 ms o 3 segundos)

        const updatePrecios = await axios.get(
          `https://www.easyposdev.somee.com/api/Clientes/GetClientesProductoPrecioByIdCliente?codigoCliente=${codigoCliente}&codigoClienteSucursal=${codigoClienteSucursal}`
        );

        setSnackbarMessage(response.data.descripcion);
        setSnackbarOpen(true);

        const deudasResponse = await axios.get(
          `https://www.easyposdev.somee.com/api/Clientes/GetClientesDeudasByIdCliente?codigoCliente=${codigoCliente}&codigoClienteSucursal=${codigoClienteSucursal}`
        );

        // setTimeout(() => {
        //   onClosePreciosClientes();
        // }, 2000);
      }
    } catch (error) {
      console.error("Error al actualizar los precios:", error);
      // Restablecer el estado de carga en caso de error
      setTimeout(() => {
        setLoadingProduct(null);
      }, 3000); // Tiempo extendido de espera en milisegundos (en este caso, 3000 ms o 3 segundos)
    }
  };

  // Calcular los resultados paginados basados en los resultados filtrados y la configuración de paginación
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedResults = filteredProducts.slice(startIndex, endIndex);

  return (
    <Grid container item xs={12} md={12} lg={12}>
      <Grid
        container
        sx={{
          minWidth: 200,
          width: "100%",
          display: "flex",
        }}
        alignItems="center"
      >
        {" "}
        <InputLabel
          sx={{
            display: "flex",
            alignItems: "center",
            margin: 1,
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          Buscador de clientes
        </InputLabel>
        <Grid item xs={12} md={12} lg={12}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              margin: 1,
            }}
          >
            <TextField
              fullWidth
              name="precio"
              placeholder="Ingrese Nombre Apellido"
              value={searchText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown} // Agregar el controlador de eventos keyDown
              sx={{
                backgroundColor: "white",
                borderRadius: "5px",
                margin: "1px",
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{
                width: "40%",
                margin: "1px",
                height: "3.4rem",
                backgroundColor: "#283048",
                color: "white",
                "&:hover": { backgroundColor: "#1c1b17" },
                marginLeft: "8px",
              }}
            >
              Buscar
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Grid
        item
        xs={12}
        md={12}
        lg={12}
        sx={{ overflowX: "auto", paddingX: 2 }}
      >
        <div style={{ display: "flex", flexWrap: "nowrap", overflowX: "auto" }}>
          {searchResults.map((result, index) => (
            <ListItem key={result.codigoCliente} sx={{ display: "inline" }}>
              <Chip
                label={`${result.nombreResponsable} ${result.apellidoResponsable}`}
                onClick={() => handleChipClick(result)}
                sx={{
                  backgroundColor: "#2196f3",
                  margin: "5px", // Ajusta el espacio entre los chips
                }}
              />
            </ListItem>
          ))}
        </div>
        {selectedClient && (
          <ListItem key={selectedClient.codigoCliente}>
            <Chip
              label={`${selectedClient.nombreResponsable} ${selectedClient.apellidoResponsable}`}
              icon={<CheckCircleIcon />}
              sx={{
                backgroundColor: "#A8EB12",
                margin: "5px", // Ajusta el espacio entre los chips
              }}
            />
          </ListItem>
        )}
      </Grid>

      {selectedClient && (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>

                <TableCell>Precio Venta</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Agregar el buscador de nombres de productos */}
              <TableRow>
                <TableCell colSpan={3}>
                  <TextField
                    fullWidth
                    placeholder="Buscar producto por nombre"
                    value={productSearchText}
                    onChange={handleProductSearchChange}
                  />
                </TableCell>
              </TableRow>
              {/* Mostrar los productos filtrados en la tabla */}
              {paginatedResults.map((product) => (
                <TableRow key={product.idProducto}>
                  <TableCell>
                    {product.nombre} <br />
                    PLU: {product.idProducto}{" "}
                  </TableCell>

                  <TableCell>
                    <TextField
                      name="precio"
                      onKeyDown={(event) => handleKeyDown(event, "precio")}
                      variant="outlined"
                      fullWidth
                      value={
                        preciosModificados[product.idProducto] !== undefined
                          ? preciosModificados[product.idProducto]
                          : product.precio
                      }
                      onChange={(e) =>
                        handlePrecioChange(e, product.idProducto)
                      }
                      inputProps={{
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                        maxLength: 7,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() =>
                        handleSaveChanges(
                          product.idProducto,
                          codigoCliente,
                          codigoClienteSucursal
                        )
                      }
                      sx={{
                        backgroundColor: "#2196f3",
                        color: "white",
                        opacity:
                          loadingProduct === product.idProducto ? 0.5 : 1, // Reducir la opacidad del botón mientras se carga solo si es el producto actual
                      }}
                      disabled={loadingProduct === product.idProducto} // Deshabilitar el botón mientras se carga solo si es el producto actual
                    >
                      {loadingProduct === product.idProducto
                        ? "Guardando..."
                        : "Guardar"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {/* {paginatedResults.map((product) => (
                <TableRow key={product.idProducto}>
                  <TableCell>{product.nombre}</TableCell>
                  <TableCell>
                    <TextField
                      name="precio"
                      onKeyDown={(event) => handleKeyDown(event, "precio")}
                      variant="outlined"
                      fullWidth
                      value={
                        preciosModificados[product.idProducto] !== undefined
                          ? preciosModificados[product.idProducto]
                          : product.precio
                      }
                      onChange={(e) =>
                        handlePrecioChange(e, product.idProducto)
                      }
                      inputProps={{
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() =>
                        handleSaveChanges(
                          product.idProducto,
                          codigoCliente,
                          codigoClienteSucursal
                        )
                      }
                      sx={{
                        backgroundColor: "#2196f3",
                        color: "white",
                        opacity: loading ? 0.5 : 1, // Reducir la opacidad del botón mientras se carga
                      }}
                      disabled={loading} // Deshabilitar el botón mientras se carga
                    >
                      {loading ? "Guardando..." : "Guardar"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))} */}
            </TableBody>
          </Table>
          {/* Paginación */}
          <TablePagination
            component="div"
            count={filteredProducts.length} // Número total de resultados
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPageOptions={[]} // Eliminar completamente las opciones de selección del número de filas por página
            labelRowsPerPage="Por página" // Cambiar el texto "rows per page" a "por página" en español
          />
        </TableContainer>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="info"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default BoxBuscador;
