import { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getCasts, getServerUrl } from "../api/api";
import {
  Home,
  Compass,
  Tv,
  FolderHeart,
  History,
  Download,
  Film,
  PlusSquare,
  Flame,
  Music,
  Gamepad2,
  Newspaper,
  Podcast,
  User,
  Settings,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

function Sidebar() {
  const { sidebarOpen, isLoggedIn, userId } = useContext(AuthContext);
  const [casts, setCasts] = useState([]);
  const location = useLocation();

  useEffect(() => {
    getCasts({ limit: 6 })
      .then((res) => {
        if (res?.data?.data && res.data.data.length > 0) {
          setCasts(res.data.data);
        }
      })
      .catch(() => {});
  }, []);

  const isCurrent = (path) => {
    if (path === "/" && (location.pathname === "/" || location.pathname === "/dashboard")) {
      return true;
    }
    return location.pathname === path;
  };

  const linkClass = (path) => {
    const active = isCurrent(path);
    return `flex items-center gap-6 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
      active
        ? "bg-[#272727] text-white font-semibold"
        : "text-[#f1f1f1] hover:bg-[#272727] hover:text-white"
    }`;
  };

  const miniLinkClass = (path) => {
    const active = isCurrent(path);
    return `flex flex-col items-center justify-center py-4 px-1 rounded-xl text-[10px] font-normal transition-colors ${
      active ? "bg-[#272727] text-white font-medium" : "text-[#aaaaaa] hover:bg-[#272727] hover:text-white"
    }`;
  };

  const getCastAvatar = (c) => {
    const img = c.image || c.avatar;
    if (!img) return "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80";
    if (img.startsWith("/uploads")) return `${getServerUrl()}${img}`;
    return img;
  };

  if (!sidebarOpen) {
    return (
      <aside className="fixed top-14 left-0 bottom-0 w-[72px] bg-[#0f0f0f] flex flex-col items-center py-2 px-1 z-40 select-none overflow-y-auto no-scrollbar">
        <Link to="/" className={`w-full ${miniLinkClass("/")}`} title="Home">
          <Home className="w-5 h-5 mb-1.5" />
          <span>Home</span>
        </Link>
        <Link to="/movies" className={`w-full ${miniLinkClass("/movies")}`} title="Explore">
          <Compass className="w-5 h-5 mb-1.5" />
          <span>Explore</span>
        </Link>
        <Link to="/cast" className={`w-full ${miniLinkClass("/cast")}`} title="Creators">
          <Tv className="w-5 h-5 mb-1.5" />
          <span>Creators</span>
        </Link>
        <Link to="/category" className={`w-full ${miniLinkClass("/category")}`} title="Topics">
          <FolderHeart className="w-5 h-5 mb-1.5" />
          <span>Topics</span>
        </Link>
        <Link to="/history" className={`w-full ${miniLinkClass("/history")}`} title="You">
          <History className="w-5 h-5 mb-1.5" />
          <span>You</span>
        </Link>
      </aside>
    );
  }

  return (
    <aside className="fixed top-14 left-0 bottom-0 w-60 bg-[#0f0f0f] flex flex-col px-3 py-3 z-40 select-none overflow-y-auto no-scrollbar border-r border-[#272727]/60">
      <div className="space-y-1 pb-3 border-b border-[#272727]">
        <Link to="/" className={linkClass("/")}>
          <Home className="w-5 h-5 flex-shrink-0" />
          <span>Home</span>
        </Link>
        <Link to="/movies" className={linkClass("/movies")}>
          <Compass className="w-5 h-5 flex-shrink-0" />
          <span>Explore Videos</span>
        </Link>
        <Link to="/cast" className={linkClass("/cast")}>
          <Tv className="w-5 h-5 flex-shrink-0" />
          <span>Creators & Channels</span>
        </Link>
        <Link to="/category" className={linkClass("/category")}>
          <FolderHeart className="w-5 h-5 flex-shrink-0" />
          <span>Topics & Categories</span>
        </Link>
      </div>

      <div className="py-3 border-b border-[#272727] space-y-1">
        <Link
          to={isLoggedIn ? `/profile/${userId || "me"}` : "/login"}
          className="flex items-center justify-between px-3 py-1.5 text-sm font-bold text-white hover:bg-[#272727] rounded-lg transition"
        >
          <span className="flex items-center gap-2">
            You <ChevronRight className="w-4 h-4 text-[#aaaaaa]" />
          </span>
        </Link>

        <Link to="/history" className={linkClass("/history")}>
          <History className="w-5 h-5 flex-shrink-0" />
          <span>History</span>
        </Link>
        <Link to="/downloads" className={linkClass("/downloads")}>
          <Download className="w-5 h-5 flex-shrink-0" />
          <span>Downloads</span>
        </Link>
        <Link to="/movie/create" className={linkClass("/movie/create")}>
          <PlusSquare className="w-5 h-5 flex-shrink-0 text-[#ff4e45]" />
          <span>Upload Studio</span>
        </Link>
      </div>

      {casts.length > 0 && (
        <div className="py-3 border-b border-[#272727] space-y-1">
          <span className="px-3 text-xs font-bold text-[#aaaaaa] uppercase tracking-wider block mb-1">
            Subscriptions & Channels
          </span>
          {casts.map((cast) => (
            <Link
              key={cast._id}
              to={`/cast/${cast._id}`}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-[#f1f1f1] hover:bg-[#272727] transition"
            >
              <img
                src={getCastAvatar(cast)}
                alt={cast.name}
                className="w-6 h-6 rounded-full object-cover flex-shrink-0 ring-1 ring-[#383838]"
              />
              <span className="truncate text-xs font-medium">{cast.name}</span>
            </Link>
          ))}
        </div>
      )}

      <div className="pt-4 px-3 text-[11px] text-[#717171] space-y-2">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <span className="hover:text-white cursor-pointer">About</span>
          <span className="hover:text-white cursor-pointer">Press</span>
          <span className="hover:text-white cursor-pointer">Copyright</span>
          <span className="hover:text-white cursor-pointer">Contact us</span>
          <span className="hover:text-white cursor-pointer">Creators</span>
        </div>
        <p className="text-[10px] text-[#555555]">© 2026 YouTube Clone LLC</p>
      </div>
    </aside>
  );
}

export default Sidebar;
