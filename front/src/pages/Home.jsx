import React from 'react'
import Banner from '../Component/Banner'
import Choose from '../Component/Choose'
import Offer from '../Component/Offer'
import Clients from '../Component/Clients'
import Started from '../Component/Started'

const Home = () => {
  return (
    <>
        <Banner />
        <Offer />
        <Choose />
        <Clients />
        <Started />
    </>
  )
}

export default Home