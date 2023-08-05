/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */


import React, { useState } from 'react';
import { TextField, Button, List, ListItem, ListItemText,Card, CardContent, CardActions } from '@mui/material';
import { styled } from '@mui/material/styles';

const FamilyManager = styled('div')({
  margin: '20px',
});

const CreateFamily = ({ addFamily }) => {
  const [familyData, setFamilyData] = useState({
    family: '', 
    subfamily: '', 
    products: '', 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFamilyData({ ...familyData, [name]: value });
  };
  const handleAddProduct = () => {
    // Split the products by comma and trim any extra spaces
    const productsArray = familyData.products.split(',').map((product) => product.trim());

    setFamilyData({ ...familyData, products: productsArray.join(',') });
  };

  const handleCreate = () => {
    // Generating a unique ID for each family (you can use any library for this purpose)
    const newFamily = { ...familyData, id: Date.now() };
    addFamily(newFamily);
    setFamilyData({ family: '', subfamily: '', products: '' }); // Fixed the wrong state key for 'family' & 'subfamily'
  };

  return (
    <div>
      <TextField label="Categoria" name="family" value={familyData.family} onChange={handleChange} />
      <TextField label="Sub-categoria" name="family" value={familyData.family} onChange={handleChange} />
     
      <TextField label="Familia" name="subfamily" value={familyData.subfamily} onChange={handleChange} />
      <TextField
        label="Sub-Familia"
        name="products"
        value={familyData.products}
        onChange={handleChange}
        
      />
       <Button variant="contained" color="primary" onClick={handleAddProduct}>
        Add Product
      </Button>
     
      <Button variant="contained" color="primary" onClick={handleCreate}>
        Crear
      </Button>
    </div>
  );
};

const FamilyList = ({ families, deleteFamily,editFamily }) => {
  const handleDelete = (familyId) => {
    deleteFamily(familyId);
  };
  const handleEdit = (familyId, field) => {
    const editedValue = prompt(`Enter the new ${field} name:`);
    if (editedValue) {
      editFamily(familyId, field, editedValue);
    }
  };

  return (
    <List>
    {families.map((family) => (
      <ListItem key={family.id}>
        <Card>
          <CardContent>
            <ListItemText primary={family.family} secondary={family.subfamily} />
          </CardContent>
          <CardActions>
            <Button color="primary" onClick={() => handleEdit(family.id, 'family')}>
              Edit Family
            </Button>
            <Button color="primary" onClick={() => handleEdit(family.id, 'subfamily')}>
              Edit Subfamily
            </Button>
            <Button color="primary" onClick={() => handleDelete(family.id)}>
              Delete
            </Button>
          </CardActions>
        </Card>
      </ListItem>
    ))}
  </List>
  );
};

const App = () => {
  const [families, setFamilies] = useState([]);

  const addFamily = (newFamily) => {
    const duplicateFamily = families.find((family) => family.name === newFamily.name);
    if (duplicateFamily) {
      // Display an error or any other appropriate action for duplicate families
      alert('Familia ya existe.');
    } else {
      setFamilies([...families, newFamily]);
    }
  };

  const deleteFamily = (familyId) => {
    const updatedFamilies = families.filter((family) => family.id !== familyId);
    setFamilies(updatedFamilies);
  };

  const editFamily = (familyId, field, editedValue) => {
    const updatedFamilies = families.map((family) => {
      if (family.id === familyId) {
        return { ...family, [field]: editedValue };
      }
      return family;
    });
    setFamilies(updatedFamilies);
  };



  return (
    <FamilyManager>
    <CreateFamily addFamily={addFamily} />
    <FamilyList families={families} deleteFamily={deleteFamily} editFamily={editFamily} />
  </FamilyManager>
  );
};
export default App;


