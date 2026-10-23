import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCategories, getServerUrl } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { FolderHeart, Plus, Compass, Play, Search, Layers } from "lucide-react";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const { sidebarOpen, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        setLoading(true);
        const res = await getCategories({ limit: 50 }).catch(() => null);
        if (res?.data?.data && res.data.data.length > 0) {
          setCategories(res.data.data);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error(err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCats();
  }, []);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const getCategoryImage = (img) => {
    if (!img) return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80";
    if (img.startsWith("/uploads")) return `${getServerUrl()}${img}`;
    return img;
  };

  return (
    <div
      className={`min-h-screen bg-[#0f0f0f] text-[#f1f1f1] pt-16 pb-16 transition-all duration-200 ${
        sidebarOpen ? "md:ml-60" : "md:ml-[72px]"
      }`}
    >
      <div className="p-4 sm:p-6 max-w-[1920px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#272727] pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
              <FolderHeart className="w-7 h-7 text-[#ff0000]" />
              <span>Topics & Playlists</span>
            </h1>
            <p className="text-xs text-[#aaaaaa] mt-1">
              Browse video collections organized by subject, genre, and topic
            </p>
          </div>

          {isLoggedIn && (
            <button
              onClick={() => navigate("/category/create")}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#ff0000] hover:bg-[#cc0000] text-white rounded-full text-xs font-bold transition shadow-lg shadow-red-600/10 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Topic</span>
            </button>
          )}
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717171]" />
          <input
            type="text"
            placeholder="Search topics & categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#181818] border border-[#303030] focus:border-[#3ea6ff] rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-[#717171] outline-none transition"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="animate-pulse bg-[#181818] p-6 rounded-2xl space-y-3">
                <div className="h-32 bg-[#272727] rounded-xl"></div>
                <div className="h-4 bg-[#272727] rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-[#181818] rounded-2xl border border-[#272727] p-8 max-w-lg mx-auto">
            <span className="text-4xl mb-3 block">📂</span>
            <h3 className="text-base font-bold text-white">
              {search ? `No categories matching "${search}"` : "No categories created yet"}
            </h3>
            <p className="text-xs text-[#aaaaaa] mt-1 mb-4">
              {search
                ? "Try checking your spelling or use different keywords"
                : "Create your first category or topic to organize your videos!"}
            </p>
            {isLoggedIn && (
              <button
                onClick={() => navigate("/category/create")}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-semibold transition"
              >
                Create Topic
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((cat, idx) => (
              <div
                key={cat._id || idx}
                onClick={() => navigate(`/movies?category=${cat._id}`)}
                className="bg-[#181818] border border-[#272727] hover:border-[#383838] rounded-2xl overflow-hidden cursor-pointer group hover:shadow-xl transition flex flex-col justify-between"
              >
                <div className="relative h-36 bg-gradient-to-tr from-[#222222] to-[#333333] overflow-hidden flex items-center justify-center">
                  <img
                    src={getCategoryImage(cat.image)}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-60"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center group-hover:scale-110 transition shadow-lg">
                      <Play className="w-5 h-5 ml-0.5 fill-white" />
                    </div>
                  </div>

                  <span className="absolute bottom-2 right-2 bg-black/80 text-[10px] text-white px-2 py-0.5 rounded font-semibold flex items-center gap-1 backdrop-blur-sm">
                    <Layers className="w-3 h-3" /> Playlist
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-[#3ea6ff] transition">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[#aaaaaa] mt-1 line-clamp-2">
                      {cat.description || "Curated video playlist • Real database topic"}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#272727] flex items-center justify-between text-xs text-[#3ea6ff] font-semibold">
                    <span>Explore topic</span>
                    <span>➔</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;