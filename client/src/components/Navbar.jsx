import { NavLink } from "react-router-dom";
import { useAuth } from "../store/auth";

export const Navbar = () => {
  const { isLoggedIn } = useAuth();

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
       
        <div className="text-3xl font-bold tracking-wide text-blue-400 hover:text-blue-300 transition-transform transform hover:scale-110">
          <NavLink to="/">ShopSphere</NavLink>
        </div>

        <nav>
          <ul className="flex space-x-6">
            <li>
              <NavLink
                to="/"
                className="text-lg hover:text-blue-300 transition"
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className="text-lg hover:text-blue-300 transition"
              >
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/items"
                className="text-lg hover:text-blue-300 transition"
              >
                Items
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className="text-lg hover:text-blue-300 transition"
              >
                Contact
              </NavLink>
            </li>

            {isLoggedIn && (
              <>
                <li>
                  <NavLink
                    to="/recommendation"
                    className="text-lg hover:text-blue-300 transition"
                  >
                    Recommendation
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/cart"
                    className="text-lg hover:text-blue-300 transition"
                  >
                    Cart
                  </NavLink>
                </li>
              </>
            )}

            {isLoggedIn ? (
              <li>
                <NavLink
                  to="/logout"
                  className="text-lg text-red-400 hover:text-red-300 transition"
                >
                  Logout
                </NavLink>
              </li>
            ) : (
              <>
                <li>
                  <NavLink
                    to="/register"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    Register
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/login"
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    Login
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};
