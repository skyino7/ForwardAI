import React from 'react'
import Navbar from '../Component/Navbar'
import Banner from '../Component/Banner'
import Offer from '../Component/Offer'
import Choose from '../Component/Choose'

const login = () => {
  return (
    <>
        <Navbar />
        <Banner />
        <Offer />
        <Choose />
        {/* <p className='login'>login</p> */}
    </>
  )
}

export default login