import React from 'react'
import Main from './Main'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

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