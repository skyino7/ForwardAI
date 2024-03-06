import React from 'react'
import Main from './Main'
import Navbar from './Navbar'
// import Topbar from './Topbar'
import "bootstrap/dist/css/bootstrap.min.css";
import './main.css'

const Layout = () => {
  return (
    <>
        <Navbar />
        <Main />
    </>
  )
}

export default Layout