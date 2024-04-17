/* eslint-disable no-unused-vars */

import Home from "./Pages/Home";
import { Route, Routes } from "react-router";
import Registro from "./Pages/Registro";
import Login from "./Pages/Login";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Usuarios from "./Pages/Usuarios";
import Precios from "./Pages/Precios";
import Proveedores from "./Pages/Proveedores";
import SideBar from "./Componentes/NavBar/SideBar"
import Productos from "./Pages/Productos"
import Clientes from "./Pages/Clientes"


import 'bootstrap/dist/css/bootstrap.min.css';
import Categorias from "./Pages/Categoria";
import SubCategorias from "./Pages/SubCategoria";
import Familias from "./Pages/Familias";
import SubFamilias from "./Pages/SubFamilias";

function App() {
  return (
    <Routes>
     
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/home" element={<Home />} />
      <Route path="/" element={<Home />} />
      <Route path="/usuarios" element={<Usuarios />} />
      <Route path="/precios" element={<Precios />} />
      <Route path="/proveedores" element={<Proveedores />} />
      <Route path="/clientes" element={<Clientes />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/categorias" element={<Categorias />} />
      <Route path="/subcategorias" element={<SubCategorias />} />
      <Route path="/familias" element={<Familias />} />
      <Route path="/subfamilias" element={<SubFamilias />} />

    </Routes>
  );
}

export default App;
