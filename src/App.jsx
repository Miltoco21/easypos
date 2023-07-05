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


import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/home" element={<Home />} />
      <Route path="/" element={<Home />} />
      <Route path="/usuarios" element={<Usuarios />} />
      <Route path="/precios" element={<Precios />} />

    </Routes>
  );
}

export default App;
