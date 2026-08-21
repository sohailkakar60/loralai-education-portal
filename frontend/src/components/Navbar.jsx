import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useEffect, useState } from "react";


function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);


  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";


  const loadUser = () => {
    try {
      const storedUser =
        localStorage.getItem("authUser");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error(
        "Navbar user error:",
        error
      );

      setUser(null);
    }
  };


  useEffect(() => {
    loadUser();

    const handleStorage = () => {
      loadUser();
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);


  useEffect(() => {
    setMobileOpen(false);
    loadUser();
  }, [location.pathname]);


  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");

    setUser(null);
    setMobileOpen(false);

    navigate("/login");
  };


  const closeMobile = () => {
    setMobileOpen(false);
  };


  const isAdmin =
    user?.role === "super_admin" ||
    user?.role === "admin";


  /*
   * AUTH PAGE HEADER
   *
   * Login / Register should NOT show the
   * full website navigation.
   */

  if (isAuthPage) {
    return (
      <header className="auth-navbar">

        <div className="auth-navbar-inner">

          <Link
            to="/login"
            className="auth-brand"
          >

            <div className="auth-brand-mark">
              L
            </div>

            <div className="auth-brand-text">

              <strong>
                Loralai Education
              </strong>

              <span>
                Portal
              </span>

            </div>

          </Link>


          <div className="auth-navbar-actions">

            <Link
              to="/login"
              className={
                location.pathname === "/login"
                  ? "auth-nav-btn auth-nav-btn-active"
                  : "auth-nav-btn"
              }
            >
              Sign In
            </Link>


            <Link
              to="/register"
              className={
                location.pathname === "/register"
                  ? "auth-nav-btn auth-nav-btn-primary"
                  : "auth-nav-btn auth-nav-btn-primary"
              }
            >
              Sign Up
            </Link>

          </div>

        </div>

      </header>
    );
  }


  return (
    <header className="site-navbar">

      <div className="container navbar-inner">


        {/* LOGO */}

        <Link
          to="/"
          className="navbar-brand"
          onClick={closeMobile}
        >

          <div className="navbar-brand-mark">
            L
          </div>

          <div className="navbar-brand-text">

            <strong>
              Loralai
            </strong>

            <span>
              Education Portal
            </span>

          </div>

        </Link>


        {/* MOBILE BUTTON */}

        <button
          type="button"
          className="navbar-mobile-btn"
          onClick={() =>
            setMobileOpen(
              (previous) => !previous
            )
          }
          aria-label="Toggle navigation"
        >

          <span />
          <span />
          <span />

        </button>


        {/* MAIN NAV */}

        <nav
          className={
            mobileOpen
              ? "navbar-links navbar-links-open"
              : "navbar-links"
          }
        >

          <NavLink
            to="/"
            onClick={closeMobile}
            className={({ isActive }) =>
              isActive
                ? "navbar-link active"
                : "navbar-link"
            }
          >
            Home
          </NavLink>


          <NavLink
            to="/schools"
            onClick={closeMobile}
            className={({ isActive }) =>
              isActive
                ? "navbar-link active"
                : "navbar-link"
            }
          >
            Schools
          </NavLink>


          <NavLink
            to="/colleges"
            onClick={closeMobile}
            className={({ isActive }) =>
              isActive
                ? "navbar-link active"
                : "navbar-link"
            }
          >
            Colleges
          </NavLink>


          <NavLink
            to="/universities"
            onClick={closeMobile}
            className={({ isActive }) =>
              isActive
                ? "navbar-link active"
                : "navbar-link"
            }
          >
            Universities
          </NavLink>


          <NavLink
            to="/academies"
            onClick={closeMobile}
            className={({ isActive }) =>
              isActive
                ? "navbar-link active"
                : "navbar-link"
            }
          >
            Academies
          </NavLink>


          <NavLink
            to="/tutors"
            onClick={closeMobile}
            className={({ isActive }) =>
              isActive
                ? "navbar-link active"
                : "navbar-link"
            }
          >
            Tutors
          </NavLink>


          <NavLink
            to="/news"
            onClick={closeMobile}
            className={({ isActive }) =>
              isActive
                ? "navbar-link active"
                : "navbar-link"
            }
          >
            News
          </NavLink>


          <NavLink
            to="/rankings"
            onClick={closeMobile}
            className={({ isActive }) =>
              isActive
                ? "navbar-link active"
                : "navbar-link"
            }
          >
            Rankings
          </NavLink>


          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={closeMobile}
              className={({ isActive }) =>
                isActive
                  ? "navbar-link admin-nav-link active"
                  : "navbar-link admin-nav-link"
              }
            >
              Admin
            </NavLink>
          )}


          <div className="navbar-user-area">

            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={closeMobile}
                  className="navbar-login-btn"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  onClick={closeMobile}
                  className="navbar-signup-btn"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="navbar-user-menu">

                <span className="navbar-user-name">
                  {user.full_name || "User"}
                </span>


                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={closeMobile}
                    className="navbar-user-link"
                  >
                    Dashboard
                  </Link>
                )}


                <button
                  type="button"
                  className="navbar-logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>

              </div>
            )}

          </div>

        </nav>

      </div>

    </header>
  );
}


export default Navbar;