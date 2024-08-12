import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="p-2 sm:p-3 md:p-4 lg:p-3 xl:p-4 bg-custom-gradient">
      <div className="container mx-auto flex justify-between items-center lg:flex-col xl:flex-row">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl font-bold font-poppins">
            DiscoverYou
          </h1>
        </div>

        {/* Hamburger Icon for mobile */}
        <button
          onClick={toggleMenu}
          className="lg:hidden text-white focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>

        {/* Nav Links */}
        <div
          className={`lg:flex flex-grow justify-end items-center ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-1 xl:space-x-2 mt-4 lg:mt-0">
            {[
              "Dashboard",
              "Contests",
              "Communities",
              "Webinars",
              "Courses",
              "Showcase",
              "Hirings",
              "Marketplace",
              "Notifications",
              "Profile",
            ].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="border p-1 lg:p-1.5 xl:p-2 border-gray-900 bg-gray-900 text-white rounded-lg hover:bg-[#f0f2b7] hover:border-gray-900 hover:text-black transition duration-200 text-xs sm:text-sm lg:text-xs xl:text-sm text-center lg:text-left"
              >
                {item}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="border p-1 lg:p-1.5 xl:p-2 border-gray-900 bg-gray-900 text-white rounded-lg hover:bg-[#f0f2b7] hover:border-gray-900 hover:text-black transition duration-200 text-xs sm:text-sm lg:text-xs xl:text-sm w-full lg:w-auto text-center"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;