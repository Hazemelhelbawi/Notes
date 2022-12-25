import React from 'react'
import { Link , NavLink} from 'react-router-dom'

export default function Navbar({ userData,logout }) {
  return (
    <>
    <nav className="navbar navbar-expand-lg ">
  <div className="container">
    <Link className="navbar-brand fs-2" to="">Notes
    <i className="px-2 fa-regular fa-note-sticky"></i>
    </Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">

      <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

      {/* {userData ?<>

        <li className="nav-item">
          <Link className="nav-link active" to="login" onClick={logout} >Logout</Link>
        </li>
        </>
        :<> <li className="nav-item">
        <Link className="nav-link active" to="register">Register</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="login">Login</Link>
      </li>
      </>  
  } */}
  {userData ? (
                <>
                <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          Hello {userData.first_name}
          </a>
          <ul className="dropdown-menu bg-dark text-white" aria-labelledby="navbarDropdown">

                <li className="dropdown-item bg-transparent">
                  <NavLink className="nav-link fs-5 " onClick={logout}>
                    Logout
                  </NavLink> 
                  </li>
          </ul>
        </li>
                </>
              ) : (
                <>
                  
                  <li className="nav-item ">
                    <NavLink className="nav-link" to="register">
                      Register
                    </NavLink>
                  </li>
                  <li className="nav-item ">
                    <NavLink className="nav-link" to="login">
                      Login
                    </NavLink>
                  </li>
                </>
              )}


      </ul>

    </div>
  </div>
</nav>
    </>
  )
}
