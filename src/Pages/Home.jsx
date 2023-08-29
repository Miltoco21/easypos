/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */

import React from 'react'  
import SideBar from '../Componentes/NavBar/SideBar'
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InfoCard from "../Componentes/Home/InfoCard"
import Card2 from "../Componentes/Home/Card2"

export const defaultTheme = createTheme;
const Home = () => {
  return (
    <>
     
     <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      <Box sx={{ display: "flex" }}>
        <SideBar />
        <InfoCard/>
        <Card2/>
        
      </Box>

      
    </ThemeProvider>

     
    </>
  )
}

export default Home