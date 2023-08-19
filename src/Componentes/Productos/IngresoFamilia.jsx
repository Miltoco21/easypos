/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import {
  createTheme,
  CssBaseline,
  Paper,
  TextField,
  MenuItem,
  InputLabel,
  ThemeProvider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
} from "@mui/material";

const IngresoFamilias = () => {
  const [errors, setErrors] = useState({ descripcionFamilia: "" });
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const [subcategories, setSubCategories] = useState([]);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");

  const [descripcionFamilia, setDescripcionFamilia] = useState("");

  const theme = createTheme();
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(
          "https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetAllCategorias"
        );
        console.log("API response:", response.data.categorias); // Add this line
        setCategories(response.data.categorias);
      } catch (error) {
        console.log(error);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (selectedCategoryId !== "") {
        try {
          const response = await axios.get(
            `https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetSubCategoriaByIdCategoria?CategoriaID=${selectedCategoryId}`
          );
          console.log(
            "https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetSubCategoriaByIdCategoria?$CategoriaID={selectedCategoryId}"
          );
          console.log("Subcategories Response:", response.data.subCategorias);
          setSubCategories(response.data.subCategorias);
          
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      }
    };

    fetchSubCategories();
  }, [selectedCategoryId]);

  const handleSuccessDialogClose = () => {
    setIsSuccessDialogOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!descripcionFamilia) {
      setErrors({
        descripcionFamilia: "Favor completar campo",
      });
      return;
    } else {
      setErrors({
        descripcionFamilia: "",
      });
    }

    try {
      const response = await axios.post(
        "https://www.easyposdev.somee.com/api/NivelMercadoLogicos/AddFamilia",
        {
          idCategoria: selectedCategoryId,
          idSubcategoria: selectedSubCategoryId,
          descripcionFamilia: descripcionFamilia,
        }
      );
      console.log(
        selectedCategoryId,
        selectedSubCategoryId,
        descripcionFamilia
      );

      console.log(response.data, "Response Debug");

      // Show the success dialog
      setIsSuccessDialogOpen(true);

      setDescripcionFamilia("");
    } catch (error) {
      console.log(error.response.data, "Error Debug");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh", width: "90vw" }}>
        <CssBaseline />

        <Grid
          item
          xs={12}
          sm={8}
          md={12}
          component={Paper}
          elevation={24}
          square
        >
          <Box
            sx={{
              my: 1,
              mx: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h4>Ingreso Familia</h4>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 2 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={12}>
                  <Grid item xs={12} sm={6} md={10}>
                    <InputLabel>Selecciona Categoría</InputLabel>
                    <Select
                      fullWidth
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                      label="Selecciona Categoría"
                    >
                      {categories.map((category) => (
                        <MenuItem
                          key={category.idCategoria}
                          value={category.idCategoria}
                        >
                          {category.descripcion}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>

                  <Grid item xs={12} sm={6} md={10}>
                    <InputLabel>Selecciona Sub-Categoría</InputLabel>
                    <Select
                      fullWidth
                      value={selectedSubCategoryId}
                      onChange={(e) => setSelectedSubCategoryId(e.target.value)}
                      label="Selecciona Sub-Categoría"
                    >
                      {subcategories.map((subcategory) => (
                        <MenuItem
                          key={subcategory.idSubcategoria}
                          value={subcategory.idSubcategoria}
                        >
                          {subcategory.descripcion}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6} md={12}>
                  <TextField
                    autoComplete="off"
                    name="descripcionFamilia"
                    required
                    fullWidth
                    id="descripcionFamilia"
                    label="Ingresa Familia"
                    error={!!errors.descripcionFamilia}
                    helperText={errors.descripcionFamilia}
                    value={descripcionFamilia}
                    onChange={(e) => setDescripcionFamilia(e.target.value)}
                    autoFocus
                  />
                </Grid>

                <Button
                  type="submit"
                  size="md"
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Guardar
                </Button>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onClose={handleSuccessDialogClose}>
        <DialogTitle>Guardado </DialogTitle>
        <DialogContent>Familia creada con éxito</DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessDialogClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default IngresoFamilias;
