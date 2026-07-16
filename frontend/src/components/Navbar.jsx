import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path
      ? "text-red-500 font-bold border-b-2 border-red-500 pb-1"
      : "text-neutral-400 hover:text-white transition duration-200";
  };

  return (
    <nav className="bg-neutral-950 border-b border-neutral-900 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 z-50 sticky top-0 shadow-md">
      {/* BRAND / LOGO */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
        <span className="text-2xl font-black tracking-tighter text-red-600 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text">
          FLIXCAST
        </span>
        <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded tracking-wide">
          PRO
        </span>
      </div>

      {/* NAVIGATION LINKS */}
      <div className="flex flex-wrap justify-center items-center gap-6 text-sm font-semibold">
        {token ? (
          <>
            <Link to="/movies" className={isActive("/movies") || isActive("/")}>
              Movies
            </Link>
            <Link to="/cast" className={isActive("/cast")}>
              Casts
            </Link>
            <Link to="/category" className={isActive("/category")}>
              Categories
            </Link>
            <Link to="/history" className={isActive("/history")}>
              Watch History
            </Link>
            <Link to="/downloads" className={isActive("/downloads")}>
              Downloads
            </Link>
          </>
        ) : (
          <span className="text-neutral-500 text-xs tracking-wider uppercase font-semibold">
            Welcome to Flixcast
          </span>
        )}
      </div>

      {/* AUTH ACTIONS */}
      <div className="flex items-center gap-4">
        {token ? (
          <>
            <Link
              to={`/profile/${userId}`}
              className="flex items-center gap-2 text-sm bg-neutral-900 border border-neutral-800 hover:border-neutral-700 px-4 py-2 rounded-xl text-neutral-300 hover:text-white transition cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-xs">
                U
              </div>
              <span>Profile</span>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition duration-200 cursor-pointer shadow-lg shadow-red-600/10"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-neutral-400 hover:text-white transition py-2 px-3"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition cursor-pointer shadow-lg shadow-red-600/10"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;