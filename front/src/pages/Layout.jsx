import React from 'react'
import { Outlet } from "react-router-dom";
// import Footer from '../Component/Footer';
import './main.css'

const Layout = () => {
  return (
    <>
      <Outlet />
    </>
  )
}

export default Layout