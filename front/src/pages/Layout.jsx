import React from 'react'
import { Outlet } from "react-router-dom";
import Footer from '../Component/Footer';

const Layout = () => {
  return (
    <>
      <Outlet />
    </>
  )
}

export default Layout