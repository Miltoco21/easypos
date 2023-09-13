import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
} from "@mui/material";

const Step1Component = () => {
  const [selectedCategoryId, setSelectedCategoryId] = React.useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = React.useState("");
  const [selectedFamilyId, setSelectedFamilyId] = React.useState("");
  const [selectedSubFamilyId, setSelectedSubFamilyId] = React.useState("");
  const [categories, setCategories] = React.useState([]);
  const [subcategories, setSubCategories] = React.useState([]);
  const [families, setFamilies] = React.useState([]);
  const [subfamilies, setSubFamilies] = React.useState([]);
  const [respuestaSINO, setRespuestaSINO] = useState("");
  const [nombre, setNombre] = useState("");
  const [marca, setMarca] = useState("");


  const [openDialog1, setOpenDialog1] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [openDialog3, setOpenDialog3] = useState(false);
  const [openDialog4, setOpenDialog4] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [newFamily, setNewFamily] = useState("");
  const [newSubFamily, setNewSubFamily] = useState("");

  const handleRespuesta = (e) => {
    setRespuestaSINO(e.target.value);
  };

  // const handleOpenDialog1 = () => {
  //   setOpenDialog1(true);
  // };
  const handleCloseDialog1 = () => {
    setOpenDialog1(false);
  };
  // const handleOpenDialog2 = () => {
  //   setOpenDialog2(true);
  // };
  const handleCloseDialog2 = () => {
    setOpenDialog2(false);
  };
  // const handleOpenDialog3 = () => {
  //   setOpenDialog3(true);
  // };
  const handleCloseDialog3 = () => {
    setOpenDialog3(false);
  };
  // const handleOpenDialog4 = () => {
  //   setOpenDialog4(true);
  // };
  const handleCloseDialog4 = () => {
    setOpenDialog4(false);
  };

  // Define selection-related functions
  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const handleSubCategorySelect = (subCategoryId) => {
    setSelectedSubCategoryId(subCategoryId);
  };

  const handleFamilySelect = (familyId) => {
    setSelectedFamilyId(familyId);
  };

  const handleSubFamilySelect = (subFamilyId) => {
    setSelectedSubFamilyId(subFamilyId);
  };
  const handleCreateCategory = () => {
    // Implement the logic to create a new category here.
    // You can use the newCategory state to get the input value.

    // After creating the category, you can close the dialog.
    setOpenDialog1(false);
  };
  const handleCreateSubCategory = () => {
    // Implement the logic to create a new category here.
    // You can use the newCategory state to get the input value.

    // After creating the category, you can close the dialog.
    setOpenDialog2(false);
  };
  const handleCreateFamily = () => {
    // Implement the logic to create a new category here.
    // You can use the newCategory state to get the input value.

    // After creating the category, you can close the dialog.
    setOpenDialog3(false);
  };
  const handleCreateSubFamily = () => {
    // Implement the logic to create a new category here.
    // You can use the newCategory state to get the input value.

    // After creating the category, you can close the dialog.
    setOpenDialog4(false);
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(
          "https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetAllCategorias"
        );
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
          setSubCategories(response.data.subCategorias);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      }
    };

    fetchSubCategories();
  }, [selectedCategoryId]);

  useEffect(() => {
    const fetchFamilies = async () => {
      if (selectedSubCategoryId !== "" && selectedCategoryId !== "") {
        try {
          const response = await axios.get(
            `https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetFamiliaByIdSubCategoria?SubCategoriaID=${selectedSubCategoryId}`
          );
          setFamilies(response.data.familias);
        } catch (error) {
          console.error("Error fetching families:", error);
        }
      }
    };

    fetchFamilies();
  }, [selectedCategoryId, selectedSubCategoryId]);

  useEffect(() => {
    const fetchSubFamilies = async () => {
      if (
        selectedFamilyId !== "" &&
        selectedCategoryId !== "" &&
        selectedSubCategoryId !== ""
      ) {
        try {
          const response = await axios.get(
            `https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetSubFamiliaByIdFamilia?FamiliaID=${selectedFamilyId}`
          );
          setSubFamilies(response.data.subFamilias);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      }
    };

    fetchSubFamilies();
  }, [selectedFamilyId, selectedCategoryId, selectedSubCategoryId]);

  return (
    <Paper
      elevation={3}
      style={{
        padding: "16px",
        width: "800px",
      }}
    >
      <Box>
        <Typography>¿Este producto requiere trazabilidad?</Typography>
        <div style={{ display: "flex", marginLeft: "16px" }}>
          <FormControl component="fieldset">
            <RadioGroup value={respuestaSINO} onChange={handleRespuesta}>
              <FormControlLabel value="Sí" control={<Radio />} label="Sí" />
              <FormControlLabel value="No" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </div>
        <InputLabel>Selecciona Categoría</InputLabel>
        <Select
          sx={{ width: "700px" }}
          fullWidth
          value={selectedCategoryId}
          onChange={(e) => handleCategorySelect(e.target.value)}
          label="Selecciona Categoría"
        >
          {categories.map((category) => (
            <MenuItem key={category.idCategoria} value={category.idCategoria}>
              {category.descripcion}
            </MenuItem>
          ))}
        </Select>
        <InputLabel>Selecciona Sub-Categoría</InputLabel>
        <Select
          sx={{ width: "700px" }}
          fullWidth
          value={selectedSubCategoryId}
          onChange={(e) => handleSubCategorySelect(e.target.value)}
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
        <InputLabel>Selecciona Familia</InputLabel>
        <Select
          sx={{ width: "700px" }}
          fullWidth
          value={selectedFamilyId}
          onChange={(e) => handleFamilySelect(e.target.value)}
          label="Selecciona Familia"
        >
          {families.map((family) => (
            <MenuItem key={family.idFamilia} value={family.idFamilia}>
              {family.descripcion}
            </MenuItem>
          ))}
        </Select>
        <InputLabel>Selecciona Subfamilia</InputLabel>
        <Select
          sx={{ width: "700px" }}
          fullWidth
          value={selectedSubFamilyId}
          onChange={(e) => handleSubFamilySelect(e.target.value)}
          label="Selecciona Subfamilia"
        >
          {subfamilies.map((subfamily) => (
            <MenuItem
              key={subfamily.idSubFamilia}
              value={subfamily.idSubFamilia}
            >
              {subfamily.descripcion}
            </MenuItem>
          ))}
        </Select>
        <InputLabel>Ingrese Nombre</InputLabel>
        <TextField

          sx={{ marginTop: "5px",width: "700px"  }}
          label=" Nombre"
          fullWidth
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <InputLabel>Ingrese Marca</InputLabel>
        <TextField
          sx={{ marginTop: "5px",width: "700px"  }}
          label="Ingresa Marca"
          fullWidth
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
        />
      </Box>

      {/* Category Select */}

      {/* <Grid itemxs={12} sm={6} md={1}>
          <Button
            size="large"
            variant="outlined"
            style={{ marginLeft: "8px" }}
            onClick={handleOpenDialog1}
          >
            +
          </Button>
        </Grid> */}

      {/* Sub-Category Select */}

      {/* <Grid itemxs={12} sm={6} md={1}>
          <Button
            size="large"
            variant="outlined"
            style={{ marginLeft: "8px" }}
            onClick={handleOpenDialog2}
          >
            +
          </Button>
        </Grid> */}

      {/* Family Select */}

      {/* <Grid itemxs={12} sm={6} md={1}>
          <Button
            size="large"
            variant="outlined"
            style={{ marginLeft: "8px" }}
            onClick={handleOpenDialog3}
          >
            +
          </Button>
        </Grid> */}

      {/* Subfamily Select */}

      {/* <Grid itemxs={12} sm={6} md={1}>
          <Button
            size="large"
            variant="outlined"
            style={{ marginLeft: "8px" }}
            onClick={handleOpenDialog4}
          >
            +
          </Button>
        </Grid> */}

      {/* <Grid itemxs={12} sm={6} md={1}>
          <Button
            size="large"
            variant="outlined"
            style={{ marginLeft: "8px" }}
            onClick={handleOpenDialog4}
          >
            +
          </Button>
        </Grid> */}
      <Dialog open={openDialog1} onClose={handleCloseDialog1}>
        <DialogTitle>Crear Categoría</DialogTitle>
        <DialogContent>
          <TextField
            label="Nueva Categoria"
            fullWidth
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog1} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleCreateCategory} color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog2} onClose={handleCloseDialog2}>
        <DialogTitle>Crear Sub-Categoría</DialogTitle>
        <DialogContent>
          <TextField
            label="Nueva Sub-Categoría"
            fullWidth
            value={newSubCategory}
            onChange={(e) => setNewSubCategory(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog2} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleCreateCategory} color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog2} onClose={handleCloseDialog2}>
        <DialogTitle>Crear Sub-Categoría</DialogTitle>
        <DialogContent>
          <TextField
            label="Nueva Sub-Categoría"
            fullWidth
            value={newSubCategory}
            onChange={(e) => setNewSubCategory(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog3} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleCreateSubCategory} color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog3} onClose={handleCloseDialog3}>
        <DialogTitle>Crear Familia</DialogTitle>
        <DialogContent>
          <TextField
            label="Nueva Familia"
            fullWidth
            value={newFamily}
            onChange={(e) => setNewFamily(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog3} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleCreateFamily} color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog4} onClose={handleCloseDialog4}>
        <DialogTitle>Crear Sub-Familia</DialogTitle>
        <DialogContent>
          <TextField
            label="Nueva Familia"
            fullWidth
            value={newSubFamily}
            onChange={(e) => setNewSubFamily(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog4} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleCreateSubFamily} color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Step1Component;
