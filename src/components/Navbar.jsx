"use client";

import { useState, useEffect } from "react";
import { RiMenuLine, RiCloseLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <nav className="bg-gray-900 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-white">
              Holidaze
            </Link>
          </div>

          <div className="sm:hidden">
            <button type="button" className="text-gray-500 hover:text-white focus:outline-none focus:text-white" onClick={toggleMenu}>
              {isMenuOpen ? <RiCloseLine size={24} /> : <RiMenuLine size={24} />}
            </button>
          </div>

          <div className="hidden sm:block">
            <ul className="flex space-x-4">
              <li>
                <Link href="/" className="text-white hover:text-gray-300 px-4 py-2">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/Venues" className="text-white hover:text-gray-300 px-4 py-2">
                  Venues
                </Link>
              </li>
              {isLoggedIn ? (
                <>
                  <li>
                    <Link href="/profile" className="text-white hover:text-gray-300 px-4 py-2">
                      View Profile
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="text-white hover:text-gray-300 px-4 py-2" onClick={handleLogout}>
                      Logout
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link href="/login" className="text-white hover:text-gray-300 px-4 py-2">
                    Login/Register
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-gray-900">
            <ul className="sm:flex sm:space-x-4 sm:justify-center py-2">
              <li>
                <Link href="#" className="text-white hover:text-gray-300 px-4 py-2 block text-center" onClick={closeMenu}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white hover:text-gray-300 px-4 py-2 block text-center" onClick={closeMenu}>
                  Venues
                </Link>
              </li>
              {isLoggedIn ? (
                <>
                  <li>
                    <Link href="/profile" className="text-white hover:text-gray-300 px-4 py-2 block text-center" onClick={closeMenu}>
                      View Profile
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="text-white hover:text-gray-300 px-4 py-2 block text-center" onClick={handleLogout}>
                      Logout
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <a href="/login" className="text-white hover:text-gray-300 px-4 py-2 block text-center" onClick={closeMenu}>
                    Login/Register
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
