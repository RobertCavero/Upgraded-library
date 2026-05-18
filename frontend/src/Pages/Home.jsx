import React from 'react'
import Navbar from '../Components/Navbar/Navbar'
import GlowBorder from '../Components/Effects/GlowBorder/GlowBorder'
import Hero from '../Components/Hero/Hero'
import LibraryDisplay from '../Components/LibraryDisplay/LibraryDisplay'
import UserPage from './UserPage/UserPage'
import LoginPage from './LoginPage/LoginPage'

const Home = () => {
  return (
    <div className='home'>
        <Navbar />
        <Hero />
        <LibraryDisplay />
        <UserPage />

        

        


    </div>
  )
}

export default Home