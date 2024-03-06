import React from 'react'
import Main from './Main'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import "bootstrap/dist/css/bootstrap.min.css";
import './main.css'

const Layout = () => {
  return (
    <>
        <Topbar />
        <Sidebar />
        <Main />
    </>
  )
}

export default Layout