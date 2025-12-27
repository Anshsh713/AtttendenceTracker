import React from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header-container">
      <nav>
        <ul className="nav-list">
          <li>
            <NavLink
              to="/Profile"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Profile
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/Home"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/History"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              History
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
