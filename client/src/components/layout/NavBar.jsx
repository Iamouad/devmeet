import React from 'react'
import { NavLink, Link } from 'react-router-dom';

export const NavBar = () => {
    return (
        <nav className="navbar bg-dark">
        <h1>
          <a href="index.html"><i className="fas fa-code"></i> DevMeet</a>
        </h1>
        <ul>
          <li><NavLink to="/">Developers</NavLink></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>
    )
}
export default NavBar;