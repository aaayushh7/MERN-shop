import { useState, useEffect } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineMenu,
  AiOutlineClose,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { to: "/", icon: AiOutlineHome, label: "Home" },
    { to: "/shop", icon: AiOutlineShopping, label: "Shop" },
    { to: "/cart", icon: AiOutlineShoppingCart, label: "Cart" },
    { to: "/favorite", icon: FaHeart, label: "Favorites" },
  ];

  const NavItem = ({ to, icon: Icon, label }) => (
    <Link
      to={to}
      className="flex items-center space-x-4 p-2 hover:bg-gray-700 rounded-lg transition-colors duration-300"
      onClick={isSmallScreen ? toggleSidebar : undefined}
    >
      <Icon className="text-2xl text-gray-300" />
      <span className={`text-gray-300 ${isSmallScreen || sidebarOpen ? 'inline-block' : 'hidden group-hover:inline-block'} transition-opacity duration-300`}>
        {label}
      </span>
      {label === "Cart" && cartItems.length > 0 && (
        <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {cartItems.reduce((a, c) => a + c.qty, 0)}
        </span>
      )}
      {label === "Favorites" && <FavoritesCount />}
    </Link>
  );

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 
    ${isSmallScreen
      ? `w-64 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
      : `w-16 hover:w-64 ${sidebarOpen ? 'w-64' : 'w-16'}`
    }
    flex flex-col justify-between p-4 text-white bg-gradient-to-b from-gray-900 to-gray-800 h-screen transition-all duration-300 ease-in-out
  `;

  return (
    <>
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-md text-white ${isSmallScreen || !sidebarOpen ? 'block' : 'hidden'}`}
      >
        {sidebarOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
      </button>

      <nav className={sidebarClasses}>
        <div className="flex flex-col space-y-4 mt-10 fixed h-screen">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </div>

        <div className="mt-auto">
          {userInfo ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-4 w-full text-left p-2 hover:bg-gray-700 rounded-lg transition-colors duration-300"
              >
                <img
                  src={userInfo.avatar || "https://via.placeholder.com/40"}
                  alt="User"
                  className="w-8 h-8 rounded-full"
                />
                <span className={`text-gray-300 ${isSmallScreen || sidebarOpen ? 'inline-block' : 'hidden group-hover:inline-block'} transition-opacity duration-300`}>
                  {userInfo.username}
                </span>
              </button>
              {dropdownOpen && (
                <ul className="absolute bottom-full left-0 w-full bg-gray-800 rounded-t-md overflow-hidden">
                  {userInfo.isAdmin && (
                    <>
                      <li><Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-700" onClick={toggleSidebar} >Dashboard</Link></li>
                      <li><Link to="/admin/productlist" className="block px-4 py-2 hover:bg-gray-700" onClick={toggleSidebar}>Products</Link></li>
                      <li><Link to="/admin/categorylist" className="block px-4 py-2 hover:bg-gray-700" onClick={toggleSidebar}>Category</Link></li>
                      <li><Link to="/admin/orderlist" className="block px-4 py-2 hover:bg-gray-700" onClick={toggleSidebar}>Orders</Link></li>
                      <li><Link to="/admin/userlist" className="block px-4 py-2 hover:bg-gray-700" onClick={toggleSidebar}>Users</Link></li>
                    </>
                  )}
                  <li><Link to="/profile" className="block px-4 py-2 hover:bg-gray-700" onClick={toggleSidebar}>Profile</Link></li>
                  <li><button onClick={logoutHandler} className="block w-full px-4 py-2 text-left hover:bg-gray-700">Logout</button></li>
                </ul>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <Link
                to="/login"
                className="flex items-center space-x-4 p-2 hover:bg-gray-700 rounded-lg transition-colors duration-300"
                onClick={toggleSidebar}
              >
                <AiOutlineLogin className="text-2xl text-gray-300" />
                <span className={`text-gray-300 ${isSmallScreen || sidebarOpen ? 'inline-block' : 'hidden group-hover:inline-block'} transition-opacity duration-300`}>
                  Login
                </span>
              </Link>
              <Link
                to="/register"
                className="flex items-center space-x-4 p-2 hover:bg-gray-700 rounded-lg transition-colors duration-300"
                onClick={toggleSidebar}
              >
                <AiOutlineUserAdd className="text-2xl text-gray-300" />
                <span className={`text-gray-300 ${isSmallScreen || sidebarOpen ? 'inline-block' : 'hidden group-hover:inline-block'} transition-opacity duration-300`}>
                  Register
                </span>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navigation;
