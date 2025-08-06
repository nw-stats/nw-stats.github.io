// import { useState } from 'react';
// import { Link, NavLink } from 'react-router-dom';

// const Navbar: React.FC = () => {
//     const [isOpen, setIsOpen] = useState(false);

//     const toggleMenu = () => setIsOpen(!isOpen);

//     return (
//         <nav className="bg-gray-800 p-4 text-white w-full top-0 z-10 fixed shadow-md">
//             <div className="container mx-auto flex justify-between items-center">
//                 <Link to={''}>
//                     <h2 className="text-xl font-bold text-blue-400" style={{ fontFamily: '"IM Fell English", serif' }}>New World League</h2>
//                 </Link>
//                 <div className="hidden md:flex space-x-4">
//                     <NavLink
//                         to="/wars"
//                         className={({ isActive }) =>
//                             isActive
//                                 ? 'px-3 py-2 bg-gray-700 rounded'
//                                 : 'px-3 py-2 hover:bg-gray-600 rounded'
//                         }
//                     >
//                         Wars
//                     </NavLink>
//                     <NavLink
//                         to="/companies"
//                         className={({ isActive }) =>
//                             isActive
//                                 ? 'px-3 py-2 bg-gray-700 rounded'
//                                 : 'px-3 py-2 hover:bg-gray-600 rounded'
//                         }
//                     >
//                         Companies
//                     </NavLink>
//                     <NavLink
//                         to="/players"
//                         className={({ isActive }) =>
//                             isActive
//                                 ? 'px-3 py-2 bg-gray-700 rounded'
//                                 : 'px-3 py-2 hover:bg-gray-600 rounded'
//                         }
//                     >
//                         Players
//                     </NavLink>
//                 </div>
//                 {/* Mobile Menu Button */}
//                 <button className="md:hidden text-white focus:outline-none" onClick={toggleMenu}>
//                     <svg
//                         className="w-6 h-6"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                         xmlns="http://www.w3.org/2000/svg"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M4 6h16M4 12h16m-7 6h7"
//                         />
//                     </svg>
//                 </button>
//             </div>
//             {/* Mobile Menu */}
//             <div className={`md:hidden bg-gray-800 p-4 ${isOpen ? 'block' : 'hidden'}`}>
//                 <NavLink
//                     to="/wars"
//                     className={({ isActive }) =>
//                         isActive ? 'block px-3 py-2 bg-gray-700 rounded mb-2' : 'block px-3 py-2 rounded mb-2 hover:bg-gray-600'
//                     }
//                     onClick={toggleMenu}
//                 >
//                     Wars
//                 </NavLink>
//                 <NavLink
//                     to="/companies"
//                     className={({ isActive }) =>
//                         isActive ? 'block px-3 py-2 bg-gray-700 rounded mb-2' : 'block px-3 py-2 rounded mb-2 hover:bg-gray-600'
//                     }
//                     onClick={toggleMenu}
//                 >
//                     Companies
//                 </NavLink>
//                 <NavLink
//                     to="/players"
//                     className={({ isActive }) =>
//                         isActive ? 'block px-3 py-2 bg-gray-700 rounded mb-2' : 'block px-3 py-2 rounded mb-2 hover:bg-gray-600'
//                     }
//                     onClick={toggleMenu}
//                 >
//                     Player Stats
//                 </NavLink>
//             </div>
//         </nav >
//     );
// };

// export default Navbar;
import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);
    const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

    const location = useLocation();
    const fromPath = encodeURIComponent(location.pathname);
    return (
        <nav className="bg-gray-800 p-4 text-white w-full top-0 z-10 fixed shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to={''}>
                    <h2 className="text-xl font-bold text-blue-400" style={{ fontFamily: '"IM Fell English", serif' }}>New World League</h2>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-4 items-center relative">
                    <NavLink
                        to="/rankings"
                        className={({ isActive }) =>
                            isActive ? 'px-3 py-2 bg-gray-700 rounded' : 'px-3 py-2 hover:bg-gray-600 rounded'
                        }
                    >
                        Rankings
                    </NavLink>
                    <NavLink
                        to="/wars"
                        className={({ isActive }) =>
                            isActive ? 'px-3 py-2 bg-gray-700 rounded' : 'px-3 py-2 hover:bg-gray-600 rounded'
                        }
                    >
                        Wars
                    </NavLink>
                    <NavLink
                        to="/companies"
                        className={({ isActive }) =>
                            isActive ? 'px-3 py-2 bg-gray-700 rounded' : 'px-3 py-2 hover:bg-gray-600 rounded'
                        }
                    >
                        Companies
                    </NavLink>
                    <NavLink
                        to="/players"
                        className={({ isActive }) =>
                            isActive ? 'px-3 py-2 bg-gray-700 rounded' : 'px-3 py-2 hover:bg-gray-600 rounded'
                        }
                    >
                        Players
                    </NavLink>
                    <NavLink
                        to={`/inaccuracy?from=${fromPath}`}
                        className="block px-4 py-2 hover:bg-gray-600 text-red-300"
                        onClick={() => setDropdownOpen(false)}
                    >
                        Report Bad Data
                    </NavLink>
                    {/* Dropdown */}
                    <div className="relative">
                        <button
                            className="px-3 py-2 hover:bg-gray-600 rounded"
                            onClick={toggleDropdown}
                        >
                            More ▾
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-gray-700 rounded shadow-lg z-20">
                                <NavLink
                                    to="/feedback"
                                    className="block px-4 py-2 hover:bg-gray-600"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Feedback
                                </NavLink>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-white focus:outline-none" onClick={toggleMenu}>
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
                        />
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden bg-gray-800 p-4 ${isOpen ? 'block' : 'hidden'}`}>
                <NavLink
                    to="/rankings"
                    className={({ isActive }) =>
                        isActive ? 'block px-3 py-2 bg-gray-700 rounded mb-2' : 'block px-3 py-2 rounded mb-2 hover:bg-gray-600'
                    }
                    onClick={toggleMenu}
                >
                    Rankings
                </NavLink>
                <NavLink
                    to="/wars"
                    className={({ isActive }) =>
                        isActive ? 'block px-3 py-2 bg-gray-700 rounded mb-2' : 'block px-3 py-2 rounded mb-2 hover:bg-gray-600'
                    }
                    onClick={toggleMenu}
                >
                    Wars
                </NavLink>
                <NavLink
                    to="/companies"
                    className={({ isActive }) =>
                        isActive ? 'block px-3 py-2 bg-gray-700 rounded mb-2' : 'block px-3 py-2 rounded mb-2 hover:bg-gray-600'
                    }
                    onClick={toggleMenu}
                >
                    Companies
                </NavLink>
                <NavLink
                    to="/players"
                    className={({ isActive }) =>
                        isActive ? 'block px-3 py-2 bg-gray-700 rounded mb-2' : 'block px-3 py-2 rounded mb-2 hover:bg-gray-600'
                    }
                    onClick={toggleMenu}
                >
                    Player Stats
                </NavLink>
                <NavLink
                    to="/inaccuracy"
                    state={{ from: location.pathname }}
                    className={({ isActive }) =>
                        isActive ? 'block px-3 py-2 bg-gray-700 rounded' : 'block px-3 py-2 rounded hover:bg-gray-600 text-red-300'
                    }
                    onClick={toggleMenu}
                >
                    Report Bad Data
                </NavLink>
                <NavLink
                    to="/feedback"
                    className={({ isActive }) =>
                        isActive ? 'block px-3 py-2 bg-gray-700 rounded' : 'block px-3 py-2 rounded hover:bg-gray-600'
                    }
                    onClick={toggleMenu}
                >
                    Feedback
                </NavLink>

            </div>
        </nav>
    );
};

export default Navbar;
