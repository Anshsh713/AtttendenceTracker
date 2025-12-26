import React from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <NavLink
              to="/Profile"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Profile
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/Home"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/History"
              className={({ isActive }) => (isActive ? "active" : "")}
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
