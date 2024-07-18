/* eslint-disable no-redeclare */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  InputLabel,
  Select,
  Grid,
  Typography,
} from "@mui/material";

const Editp2 = ({ product, open, handleClose }) => {
  const apiUrl = import.meta.env.VITE_URL_API2;

  const [editedProduct, setEditedProduct] = useState({});
  const [refresh, setRefresh] = useState(false);

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [selectedFamilyId, setSelectedFamilyId] = useState("");
  const [selectedSubFamilyId, setSelectedSubFamilyId] = useState("");
  const [subcategories, setSubCategories] = useState([]);
  const [families, setFamilies] = useState([]);
  const [subfamilies, setSubFamilies] = useState([]);

  const [marcas, setMarcas] = useState([]);
  const [selectedBodegaId, setSelectedBodegaId] = useState("");
  const [selectedProveedorId, setSelectedProveedorId] = useState("");

  const [bodegas, setBodegas] = useState([]);
  const [proveedor, setProveedor] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  const [selectedMarcaId, setSelectedMarcaId] = useState("");

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  //INICIADOR DE DATOS
  useEffect(() => {
    // Initialize editedProduct when the component mounts
    setEditedProduct(product);
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(
        `${import.meta.env.VITE_URL_API2}/NivelMercadoLogicos/GetAllCategorias`
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
      if (selectedCategoryId ) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_URL_API2}/NivelMercadoLogicos/GetSubCategoriaByIdCategoria?CategoriaID=${idCategoriaFind.idCategoria}`
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



  useEffect(() => {
    const fetchFamilies = async () => {
      if (selectedSubCategoryId !== "" && selectedCategoryId !== "") {
        try {
          console.log("selectedSubCategoryId", selectedSubCategoryId)
          console.log("subcategories", subcategories)
          const SubCategoriaFind = subcategoriesFind.find(sc=> sc.descripcion === selectedSubCategoryId);
          console.log("idCategoriaFind", SubCategoriaFind)

          const response = await axios.get(
            `${import.meta.env.VITE_URL_API2}/NivelMercadoLogicos/GetFamiliaByIdSubCategoria?SubCategoriaID=${SubCategoriaFind.idSubcategoria}`
          );

          console.log("n5 Families Response:", response.data.familias);
          setFamilies(response.data.familias);
        } catch (error) {
          console.error("Error fetching Families:", error);
        }
      }
    };

    fetchFamilies();
  }, [selectedSubCategoryId]);

  

  useEffect(() => {
    const fetchSubFamilies = async () => {
      if (
        selectedFamilyId !== "" &&
        selectedCategoryId !== "" &&
        selectedSubCategoryId !== ""
      ) {
        try {
          console.log("selectedFamilyId", selectedFamilyId)
          console.log("families", families)
          const familiaFind = familiesFind.find(f=> f.descripcion === selectedFamilyId)
          console.log("familiaFind", familiaFind)

          const response = await axios.get(
            `${import.meta.env.VITE_URL_API2}/NivelMercadoLogicos/GetSubFamiliaByIdFamilia?FamiliaID=${familiaFind.idFamilia}`
          );

          console.log("n6 SubFamilies Response:", response.data.subFamilias);
          setSubFamilies(response.data.subFamilias);
        } catch (error) {
          console.error("Error fetching SubFamilies:", error);
        }
      }
    };

    fetchSubFamilies();
  }, [selectedFamilyId]);

  // useEffect(() => {
  //   const fetchProveedores = async () => {
  //     try {
  //       const response = await axios.get(
  //         "https://www.easyposdev.somee.com/api/Proveedores/GetAllProveedores"
  //       );
  //       console.log("API response:", response.data.proveedores);
  //       setProveedores(response.data.proveedores);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchProveedores();
  // }, []);

  // useEffect(() => {
  //   const fetchMarcas = async () => {
  //     try {
  //       const response = await axios.get(
  //         "https://www.easyposdev.somee.com/api/Marcas/GetAllMarcas"
  //       );
  //       setMarcas(response.data.marcas);
  //       console.log(response.data.marcas);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchMarcas();
  // }, [refresh]);

  ////Datos iniciales de edicion

  // useEffect(() => {
  //   setSelectedMarcaId(editedProduct.marca || "");
  // }, [editedProduct]);

  // useEffect(() => {
  //   setSelectedProveedorId(editedProduct.proveedor || "");
  // }, [editedProduct]);

  useEffect(() => {
    setSelectedCategoryId(editedProduct.categoria || "");
  }, [editedProduct]);

  // useEffect(() => {
  //   setSelectedSubCategoryId(editedProduct.subCategoria || "");
  // }, [editedProduct]);

  // useEffect(() => {
  //   setSelectedFamilyId(editedProduct.familia || "");
  // }, [editedProduct]);

  // useEffect(() => {
  //   setSelectedSubFamilyId(editedProduct.subFamilia || "");
  // }, [editedProduct]);

  
 
  
 

  const handleFieldChange = (e) => {
    // Update the edited product state on field change
    const { name, value } = e.target;
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const closeSuccessDialog = () => {
    setSuccessDialogOpen(false);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const idCategoria = categories.find(categoria=> categoria.descripcion ===editedProduct.categoria);
    const idSubCategoriaFind = subcategoriesFind.find(scategoria=> scategoria.descripcion === editedProduct.subCategoria);
    const idFamiliaFind = familiesFind.find(fam=> fam.descripcion === editedProduct.familia);
    const idSubFamiliaFind = subfamiliesFind.find(sf=> sf.descripcion === editedProduct.subFamilia)

    if(idCategoria){
      console.log("idFamiliaFind", idFamiliaFind);
      const idCategoriaFil = idCategoria.idCategoria;
      const idSubCategoriaFil = idSubCategoriaFind.idSubcategoria;
      const idFamiliaFil = idFamiliaFind.idFamilia;
      const idSubFamiliaFil = idSubFamiliaFind.idSubFamilia;


      var nuevoObjetoActualizado = {
        ...editedProduct,
        categoria: idCategoriaFil,
        subCategoria: idSubCategoriaFil,
        familia: idFamiliaFil,
        subFamilia: idSubFamiliaFil

      };
      console.log("putnuevoobjeto", nuevoObjetoActualizado);
    }else{
      var nuevoObjetoActualizado = {
        ...editedProduct,
      };
    }

    

    try {
      const response = await axios.put(
      `${import.meta.env.VITE_URL_API2}/ProductosTmp/UpdateProducto`, nuevoObjetoActualizado
      );
      console.log("API Response:", response.data);

      if (response.status === 201) {
        console.log("Producto updated successfully:", response.data);
        setIsEditSuccessful(true);
        setSuccessDialogOpen(true);
        setSuccessMessage(response.data.message);
        setRefresh((prevRefresh) => !prevRefresh);
      }
    } catch (error) {
      console.error("Error updating producto:", error);
      console.log("Full error object:", error);
      console.log("Validation Errors:", error.response.data.errors);

      if (error.response) {
        console.log("Server Response:", error.response.data);
      }

      setErrorMessage(error.message);
      setOpenErrorDialog(true);
    }

    console.log("Edited Product:", editedProduct);
    // Additional logic to update the product in the database can be added here
    handleClose();
  };

  return (
    //fullScreen
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Editar Producto</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={8}>
            <TextField
              name="nombre"
              label="Nombre Producto"
              value={editedProduct.nombre || ""}
              onChange={(e) => {
                // setSelectedCategoryId(e.target.value);
                // // setEditedProduct.categoria=e.target.value;
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  nombre: e.target.value,
                }));
              }}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <InputLabel>Selecciona Categoría</InputLabel>
            <Select
              fullWidth
              value={selectedCategoryId}
              key={selectedCategoryId}
              
              onChange={(e) => {
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                 
                  // categoria: e.target.value,
                  // categoriaDes: e.target.name, // Update the categoria property
                }));
              }}
              label="Selecciona Categoría"
            >
              <MenuItem
                  key={selectedCategoryId}
                  value={editedProduct.categoria || ""}
                  name={editedProduct.categoria}
              >
                {editedProduct.categoria}
              </MenuItem>
              {categories.map((category) => (
                <MenuItem
                  key={category.idCategoria}
                  value={category.descripcion}
                >
                  {category.descripcion}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={6}>
            <InputLabel>Selecciona Sub-Categoría</InputLabel>
            <Select
              fullWidth
              value={editedProduct.subCategoria || ""}
              onChange={(e) => {
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  subCategoria: e.target.value,
                }));
              }}
              label="Selecciona Sub-Categoría"
            >
              <MenuItem
                key={editedProduct.id}
                value={editedProduct.subCategoria || ""}
              >
                {editedProduct.subCategoria}
              </MenuItem>
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

          <Grid item xs={6}>
            <InputLabel>Selecciona Familia</InputLabel>
            <Select
              fullWidth
              value={selectedFamilyId}
              onChange={(e) => {
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  familia: e.target.value,
                }));
              }}
              label="Selecciona Familia"
            >
              <MenuItem
                key={editedProduct.id}
                value={editedProduct.familia || ""}
              >
                {editedProduct.familia}
              </MenuItem>
              {families.map((family) => (
                <MenuItem key={family.idFamilia} value={family.idFamilia}>
                  {family.descripcion}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={6}>
            <InputLabel>Selecciona Sub Familia</InputLabel>
            <Select
              fullWidth
              value={selectedSubFamilyId}
              onChange={(e) => {
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  subFamilia: e.target.value,
                }));
              }}
              label="Selecciona SubFamilia"
            >
              <MenuItem
                key={editedProduct.id}
                value={editedProduct.subFamilia || ""}
              >
                {editedProduct.subFamilia}
              </MenuItem>
              {subfamilies.map((subfamily) => (
                <MenuItem
                  key={subfamily.idSubFamilia}
                  value={subfamily.idSubFamilia}
                >
                  {subfamily.descripcion}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={6}>
            <InputLabel>Selecciona Marca</InputLabel>
            <Select
              fullWidth
              value={selectedMarcaId}
              onChange={(e) => {
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  marca: e.target.value,
                }));
              }}
              label="Selecciona Marca"
            >
              <MenuItem
                key={editedProduct.id}
                value={editedProduct.marca || ""}
              >
                {editedProduct.marca}
              </MenuItem>
              {marcas.map((marca) => (
                <MenuItem key={marca.id} value={marca.nombre}>
                  {marca.nombre}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={6}>
            <InputLabel>Ingresa Proveedor</InputLabel>
            <Select
              fullWidth
              value={selectedProveedorId}
              onChange={(e) => {
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  proveedor: e.target.value,
                }));
              }}
              label="Selecciona Proveedor"
            >
              <MenuItem value={editedProduct.id || ""}>
                {editedProduct.proveedor}
              </MenuItem>
              {proveedores.map((proveedor) => (
                <MenuItem
                  key={proveedor.id}
                  value={proveedor.nombreResponsable}
                >
                  {proveedor.nombreResponsable}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={6}>
            <TextField
              name="precioCosto"
              label="Precio Costo"
              value={editedProduct.precioCosto || ""}
              onChange={(e) => {
                // setSelectedCategoryId(e.target.value);
                // // setEditedProduct.categoria=e.target.value;
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  precioCosto: e.target.value,
                }));
              }}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              name="precioVenta"
              label="Precio Venta"
              value={editedProduct.precioVenta || ""}
              onChange={(e) => {
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  precioVenta: e.target.value,
                }));
              }}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              name="stockInicial"
              label="Stock Inicial"
              value={editedProduct.stockInicial || ""}
              onChange={(e) => {
                // setSelectedCategoryId(e.target.value);
                // // setEditedProduct.categoria=e.target.value;
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  stockInicial: e.target.value,
                }));
              }}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              name="stockCritico"
              label="Stock Crítico"
              value={editedProduct.stockCritico || ""}
              onChange={(e) => {
                // setSelectedCategoryId(e.target.value);
                // // setEditedProduct.categoria=e.target.value;
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  stockCritico: e.target.value,
                }));
              }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Guardar
            </Button>
            <Button variant="contained" onClick={handleClose}>
              Cerrar
            </Button>
          </Grid>
        </Grid>
      </DialogContent>

      <Dialog open={successDialogOpen} onClose={closeSuccessDialog}>
        <DialogTitle> Edición Exitosa </DialogTitle>
        <DialogContent>
          <Typography>{successMessage}</Typography>{" "}
          {/* Aquí se muestra el mensaje de éxito */}
        </DialogContent>
      </Dialog>

      <Dialog open={openErrorDialog} onClose={closeSuccessDialog}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
          <DialogContentText>
            Ingrese uno nuevo y repita el proceso
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSuccessDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default Editp2;
