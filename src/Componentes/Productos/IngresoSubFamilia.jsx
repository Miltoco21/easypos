/* eslint-disable react-hooks/exhaustive-deps */
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

const IngresoSubFamilias = () => {
  const theme = createTheme();

  const [errors, setErrors] = useState({ descripcionSubFamilia: "" });
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [selectedFamilyId, setSelectedFamilyId] = useState("");
  const [subcategories, setSubCategories] = useState([]);
  const [families, setFamilies] = useState([]);
  const [subfamilies, setSubFamilies] = useState([]);
  const [descripcionSubFamilia, setDescripcionSubFamilia] = useState("");

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
          
          console.log("Subcategories Response:", response.data.subCategorias);
          setSubCategories(response.data.subCategorias);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      }
    };

    fetchSubCategories();
  }, [selectedCategoryId]);

  //&& selectedFamilyId!= ""

  useEffect(() => {
    const fetchFamilies = async () => {
      if (selectedSubCategoryId !== "" && selectedCategoryId !== "") {
        try {
          const response = await axios.get(
            `https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetFamiliaByIdSubCategoria?SubCategoriaID=${selectedSubCategoryId}`
          );

          console.log("Families Response:", response.data.familias);
          setFamilies(response.data.familias);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      }
    };

    fetchFamilies();
  }, [selectedSubCategoryId]);

  useEffect(() => {
    const fetchSubFamilies = async () => {
      if (selectedFamilyId !== "" && selectedCategoryId !== "" && selectedSubCategoryId !== "") {
        try {
          const response = await axios.get(
            `https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetSubFamiliaByIdFamilia?FamiliaID=${selectedFamilyId}`
          );

          console.log("SubFamilies Response:", response.data.subFamilias);
          setSubFamilies(response.data.subFamilias);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      }
    };

    fetchSubFamilies();
  }, [selectedFamilyId]);



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!descripcionSubFamilia) {
      setErrors({
        descripcionSubFamilia: "Favor completar campo",
      });
      return;
    } else {
      setErrors({
        descripcionSubFamilia: "",
      });
    }

    try {
      const response = await axios.post(
        "https://www.easyposdev.somee.com/api/NivelMercadoLogicos/AddSubFamilia",
        {
          idCategoria: selectedCategoryId,
          idSubcategoria: selectedSubCategoryId,
          idFamilia: selectedFamilyId,
          descripcionSubFamilia: descripcionSubFamilia,
        }
      );
      console.log(
        selectedCategoryId,
        selectedSubCategoryId,

        descripcionSubFamilia
      );

      console.log(response.data, "Response Debug");

      // Show the success dialog
      setIsSuccessDialogOpen(true);

      setDescripcionSubFamilia("");
    } catch (error) {
      console.log(error.response.data, "Error Debug");
    }
  };

  const handleSuccessDialogClose = () => {
    setIsSuccessDialogOpen(false);
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
            <h4>Ingreso SubFamilia</h4>
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
                <Grid item xs={12} sm={6} md={10}>
                  <InputLabel>Selecciona Familia </InputLabel>
                  <Select
                    fullWidth
                    value={selectedFamilyId}
                    onChange={(e) => setSelectedFamilyId(e.target.value)}
                    label="Selecciona Familia"
                  >
                    {families.map((family) => (
                      <MenuItem key={family.idFamilia} value={family.idFamilia}>
                        {family.descripcion}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12} sm={6} md={10}>
                  <TextField
                    autoComplete="off"
                    name="descripcionSubFamilia"
                    required
                    fullWidth
                    id="descripcionSubFamilia"
                    label="Nombre Sub-Familia"
                    error={!!errors.descripcionSubFamilia}
                    helperText={errors.descripcionSubFamilia}
                    value={descripcionSubFamilia}
                    onChange={(e) => setDescripcionSubFamilia(e.target.value)}
                    autoFocus
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                size="md"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Guardar
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onClose={handleSuccessDialogClose}>
        <DialogTitle>Guardado </DialogTitle>
        <DialogContent>SubFamilia creada con éxito</DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessDialogClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};
export default IngresoSubFamilias;
