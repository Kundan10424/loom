import React, { useEffect, useState } from "react";
import { HiOutlineMenu } from "react-icons/hi";
import { FaMoon, FaSun } from "react-icons/fa";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    if (saved === "dark") document.documentElement.classList.add("dark");
    setDarkTheme(saved === "dark");
  }, []);

  const toggleTheme = () => {
    if (darkTheme) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkTheme(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkTheme(true);
    }
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleClickOutside = () => setMenuOpen(false);
    if (menuOpen) window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  return (
    <nav
      className="w-full flex justify-between items-center px-6 py-4 shadow-md"
      style={{ backgroundColor: "var(--navbar-bg)" }}
    >
      {/* Logo */}
      <div className="font-bold text-xl" style={{ color: "var(--text-color)" }}>
        Loom
      </div>

      {/* Right */}
      <div className="flex items-center gap-4 relative">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:opacity-80"
          style={{ color: "var(--text-color)" }}
        >
          {darkTheme ? <FaMoon size={20} /> : <FaSun fill="orange" size={20} />}
        </button>

        <button
          onClick={toggleMenu}
          className="p-2 rounded-md hover:opacity-80"
          style={{ color: "var(--text-color)" }}
        >
          <HiOutlineMenu size={24} />
        </button>

        {menuOpen && (
          <div
            className="absolute right-0 mt-2 w-40 shadow-lg rounded-md z-50 p-2"
            style={{ backgroundColor: "var(--card-bg)", color: "var(--text-color)" }}
          >
            <ul className="p-0">
              <li>
                <button className="w-full text-left px-2 py-1">Help ?</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
