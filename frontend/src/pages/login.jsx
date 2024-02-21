import React from 'react'
import Navbar from '../Component/Navbar'
import Banner from '../Component/Banner'
import Offer from '../Component/Offer'
import Choose from '../Component/Choose'
import Clients from '../Component/Clients'

const login = () => {
  return (
    <>
        <Navbar />
        <Banner />
        <Offer />
        <Choose />
        <Clients />
        {/* <p className='login'>login</p> */}
    </>
  )
}

export default login