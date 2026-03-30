import React from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {

    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    // Clear stored login data if you have any
    localStorage.clear();

    // Redirect to login page
    navigate("/");
  }

  return (
    <div>
      <nav className="navbar bg-body-tertiary position-sticky">
        <div className="container-fluid px-5 py-3 dropdown-center">

          <img src="/AIMS-Logo.PNG" className="logo-Icon" alt="AIMS Logo" />

          <img
            src="/user.png"
            className="profile-Icon dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            role="button"
            alt="Menu"
          />

          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <button
                className="dropdown-item"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </ul>

        </div>
      </nav>
    </div>
  )
}

export default Navbar