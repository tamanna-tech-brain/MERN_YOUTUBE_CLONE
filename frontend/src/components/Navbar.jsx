import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  Menu,
  Search,
  Mic,
  Video,
  Bell,
  User,
  LogOut,
  History,
  Download,
  Settings,
  X,
  PlusSquare,
  Sparkles,
} from "lucide-react";

function Navbar() {
  const { isLoggedIn, userId, username, logout, toggleSidebar, globalSearch, setGlobalSearch } =
    useContext(AuthContext);
  const [searchInput, setSearchInput] = useState(globalSearch || "");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setGlobalSearch(searchInput.trim());
      navigate(`/movies?search=${encodeURIComponent(searchInput.trim())}`);
    } else {
      setGlobalSearch("");
      navigate(`/movies`);
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setGlobalSearch("");
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-[#0f0f0f] border-b border-[#272727] z-50 px-4 flex items-center justify-between select-none">
      
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          aria-label="Toggle navigation menu"
          className="p-2 rounded-full hover:bg-[#272727] active:bg-[#383838] text-white transition duration-150 cursor-pointer"
        >
          <Menu className="w-5 h-5 text-[#f1f1f1]" />
        </button>

        <Link
          to="/"
          className="flex items-center gap-1.5 focus:outline-none group"
          title="YouTube Home"
        >
          
          <div className="relative flex items-center">
            <div className="w-8 h-6 bg-[#ff0000] rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[7px] border-l-white border-b-[4px] border-b-transparent ml-0.5"></div>
            </div>
            <span className="ml-1.5 text-xl font-bold tracking-tighter text-white font-sans flex items-center">
              YouTube
              <span className="text-[10px] text-[#aaaaaa] font-medium ml-1 self-start uppercase tracking-normal">
                Clone
              </span>
            </span>
          </div>
        </Link>
      </div>

      
      <div className="hidden sm:flex items-center justify-center flex-1 max-w-[640px] mx-4">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center w-full max-w-[560px]"
        >
          <div className="flex items-center flex-1 h-10 bg-[#121212] border border-[#303030] focus-within:border-[#1c62b9] rounded-l-full px-4 ml-8 transition-colors">
            <Search className="w-4 h-4 text-[#717171] mr-3 hidden sm:block flex-shrink-0" />
            <input
              type="text"
              placeholder="Search videos, topics, creators..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-transparent text-[#f1f1f1] text-sm outline-none placeholder-[#888888]"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="p-1 hover:bg-[#272727] rounded-full text-[#aaaaaa] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            title="Search"
            className="h-10 px-6 bg-[#222222] hover:bg-[#272727] border border-l-0 border-[#303030] rounded-r-full text-[#f1f1f1] flex items-center justify-center cursor-pointer transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        
        <button
          type="button"
          onClick={() => {
            alert("Voice search listening... (Speak now or type in search)");
          }}
          title="Search with your voice"
          className="ml-3 p-2.5 rounded-full bg-[#222222] hover:bg-[#272727] text-white transition duration-150 cursor-pointer hidden md:flex"
        >
          <Mic className="w-4 h-4 text-[#f1f1f1]" />
        </button>
      </div>

      
      <div className="flex items-center gap-2 sm:gap-3">
        
        <button
          onClick={() => navigate("/movies")}
          className="sm:hidden p-2 rounded-full hover:bg-[#272727] text-white"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        
        <button
          onClick={() => {
            if (isLoggedIn) {
              navigate("/movie/create");
            } else {
              navigate("/login");
            }
          }}
          className="flex items-center gap-2 h-9 px-3 rounded-full bg-[#272727] hover:bg-[#383838] text-white text-sm font-medium transition cursor-pointer"
          title="Create / Upload Video"
        >
          <Video className="w-4 h-4 text-[#ff0000]" />
          <span className="hidden md:inline text-xs font-semibold">Create</span>
        </button>

        
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-full hover:bg-[#272727] text-white relative transition cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-[#f1f1f1]" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#cc0000] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#212121] border border-[#383838] rounded-xl shadow-2xl py-3 z-50">
              <div className="px-4 pb-2 border-b border-[#303030] flex justify-between items-center">
                <span className="font-semibold text-sm text-white">Notifications</span>
                <span className="text-xs text-[#3ea6ff] cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="divide-y divide-[#2a2a2a] max-h-72 overflow-y-auto">
                <div className="p-3 hover:bg-[#272727] transition cursor-pointer flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-red-600/20 text-[#ff4e45] flex items-center justify-center flex-shrink-0 font-bold text-xs">
                    YT
                  </div>
                  <div>
                    <p className="text-xs text-[#f1f1f1] font-medium leading-tight">
                      Fireship uploaded: "Building an Autonomous AI Agent in 2026"
                    </p>
                    <span className="text-[11px] text-[#aaaaaa] mt-1 block">2 hours ago</span>
                  </div>
                </div>
                <div className="p-3 hover:bg-[#272727] transition cursor-pointer flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600/20 text-[#3ea6ff] flex items-center justify-center flex-shrink-0 font-bold text-xs">
                    4K
                  </div>
                  <div>
                    <p className="text-xs text-[#f1f1f1] font-medium leading-tight">
                      Cinema Blend 4K premiered a new video breakdown.
                    </p>
                    <span className="text-[11px] text-[#aaaaaa] mt-1 block">Yesterday</span>
                  </div>
                </div>
                <div className="p-3 hover:bg-[#272727] transition cursor-pointer flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-600/20 text-green-400 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                    🎧
                  </div>
                  <div>
                    <p className="text-xs text-[#f1f1f1] font-medium leading-tight">
                      Lofi Girl started a new live chill stream.
                    </p>
                    <span className="text-[11px] text-[#aaaaaa] mt-1 block">3 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        
        {isLoggedIn ? (
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#cc0000] to-[#ff4e45] text-white font-bold text-sm flex items-center justify-center cursor-pointer ring-2 ring-transparent hover:ring-[#3ea6ff] transition"
              title={username}
            >
              {username ? username.charAt(0).toUpperCase() : "U"}
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#282828] border border-[#3f3f3f] rounded-xl shadow-2xl py-2 z-50 text-sm">
                <div className="px-4 py-3 border-b border-[#383838] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#cc0000] text-white font-bold flex items-center justify-center text-base">
                    {username ? username.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-semibold text-white truncate">{username}</p>
                    <p className="text-xs text-[#aaaaaa] truncate">@{username.toLowerCase().replace(/\s+/g, "")}</p>
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    to={`/profile/${userId || "me"}`}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#383838] text-[#f1f1f1] transition"
                  >
                    <User className="w-4 h-4 text-[#aaaaaa]" />
                    <span>Your channel</span>
                  </Link>
                  <Link
                    to="/movie/create"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#383838] text-[#f1f1f1] transition"
                  >
                    <PlusSquare className="w-4 h-4 text-[#aaaaaa]" />
                    <span>YouTube Studio</span>
                  </Link>
                  <Link
                    to="/history"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#383838] text-[#f1f1f1] transition"
                  >
                    <History className="w-4 h-4 text-[#aaaaaa]" />
                    <span>Watch history</span>
                  </Link>
                  <Link
                    to="/downloads"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#383838] text-[#f1f1f1] transition"
                  >
                    <Download className="w-4 h-4 text-[#aaaaaa]" />
                    <span>Downloads</span>
                  </Link>
                </div>

                <div className="border-t border-[#383838] pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#383838] text-[#ff4e45] text-left transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 h-9 px-3.5 rounded-full border border-[#3ea6ff] text-[#3ea6ff] hover:bg-[#263850] text-sm font-semibold transition"
          >
            <User className="w-4 h-4" />
            <span className="text-xs">Sign in</span>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;