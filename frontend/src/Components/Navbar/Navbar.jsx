import React from 'react'
import "./Navbar.css"


const Navbar = () => {
  return (
    <div className='navbar'>
        <div className='navbar-logo'>Logo</div>
        
        <ul className='navbar-links'>
            <li><a href='#'>Home</a></li>
            <li><a href="#">Sobre</a></li>
            <li><a href="#">Contato</a></li>
        </ul>

        <div className='btns'>
            <button className='btn-login'>Login</button>
            <button className='btn-registro'>Registrar</button>
        </div>

    </div>
    
  )
}

export default Navbar