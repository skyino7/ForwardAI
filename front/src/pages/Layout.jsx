import React from 'react'
import { Outlet } from "react-router-dom";
import Navbar from '../Component/Navbar';
import Banner from '../Component/Banner';

const Layout = () => {
  return (
    <>
      <Navbar />
      {/* <Banner /> */}
      <Outlet />
    </>
  )
}

export default Layout