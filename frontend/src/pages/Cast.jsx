import { useState, useEffect, useCallback, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCasts, getServerUrl } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { Tv, Plus, CheckCircle2, Search } from "lucide-react";

const Cast = () => {
  const [casts, setCasts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribedMap, setSubscribedMap] = useState({});
  const { sidebarOpen, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchCasts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getCasts({ limit: 50, search }).catch(() => null);
      let liveCasts = [];
      if (res?.data?.data && res.data.data.length > 0) {
        liveCasts = res.data.data.map((c) => {
          const img = c.image || c.avatar;
          return {
            _id: c._id,
            name: c.name,
            role: c.role || "Creator / Filmmaker",
            avatar: img
              ? img.startsWith("/uploads")
                ? `${getServerUrl()}${img}`
                : img
              : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
            subscribers: "1.2M",
            bio: c.bio || "Official creator on YouTube Clone.",
            verified: true,
          };
        });
      }

      setCasts(liveCasts);
    } catch (err) {
      console.error(err);
      setCasts([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchCasts();
  }, [fetchCasts]);

  const toggleSubscribe = (id) => {
    setSubscribedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filtered = casts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

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
              <Tv className="w-7 h-7 text-[#ff0000]" />
              <span>Channels & Creators</span>
            </h1>
            <p className="text-xs text-[#aaaaaa] mt-1">
              Follow featured filmmakers, artists, and educators
            </p>
          </div>

          {isLoggedIn && (
            <button
              onClick={() => navigate("/cast/create")}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#ff0000] hover:bg-[#cc0000] text-white rounded-full text-xs font-bold transition shadow-lg shadow-red-600/10 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Creator</span>
            </button>
          )}
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717171]" />
          <input
            type="text"
            placeholder="Search channels & creators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#181818] border border-[#303030] focus:border-[#3ea6ff] rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-[#717171] outline-none transition"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="animate-pulse bg-[#181818] p-6 rounded-2xl space-y-4">
                <div className="w-20 h-20 bg-[#272727] rounded-full mx-auto"></div>
                <div className="h-4 bg-[#272727] rounded w-1/2 mx-auto"></div>
                <div className="h-3 bg-[#272727] rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-[#181818] rounded-2xl border border-[#272727] p-8 max-w-lg mx-auto">
            <span className="text-4xl mb-3 block">🎬</span>
            <h3 className="text-base font-bold text-white">
              {search ? `No creators matching "${search}"` : "No creators added yet"}
            </h3>
            <p className="text-xs text-[#aaaaaa] mt-1 mb-4">
              {search ? "Try searching for a different channel name" : "Add your first creator to start showcasing channels!"}
            </p>
            {isLoggedIn && (
              <button
                onClick={() => navigate("/cast/create")}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-semibold transition"
              >
                Add Creator
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((cast) => {
              const isSub = !!subscribedMap[cast._id];
              return (
                <div
                  key={cast._id}
                  className="bg-[#181818] border border-[#272727] hover:border-[#383838] p-6 rounded-2xl flex flex-col items-center text-center justify-between group transition hover:shadow-xl"
                >
                  <Link to={`/cast/${cast._id}`} className="flex flex-col items-center">
                    <div className="relative mb-3">
                      <img
                        src={cast.avatar}
                        alt={cast.name}
                        className="w-24 h-24 rounded-full object-cover ring-2 ring-[#303030] group-hover:ring-[#3ea6ff] transition"
                      />
                      {cast.verified && (
                        <CheckCircle2 className="w-5 h-5 text-[#3ea6ff] absolute bottom-0 right-1 bg-[#181818] rounded-full" />
                      )}
                    </div>

                    <h3 className="font-bold text-base text-white group-hover:text-[#3ea6ff] transition">
                      {cast.name}
                    </h3>
                    <span className="text-xs text-[#aaaaaa] mt-0.5">
                      {cast.subscribers || "1.2M"} subscribers • {cast.role}
                    </span>
                    <p className="text-xs text-[#717171] line-clamp-2 mt-2 leading-relaxed px-2">
                      {cast.bio}
                    </p>
                  </Link>

                  <div className="mt-5 w-full flex items-center justify-center gap-2">
                    <button
                      onClick={() => toggleSubscribe(cast._id)}
                      className={`w-full py-2 px-4 rounded-full text-xs font-semibold transition cursor-pointer ${
                        isSub
                          ? "bg-[#272727] text-white hover:bg-[#383838]"
                          : "bg-white text-black hover:bg-neutral-200"
                      }`}
                    >
                      {isSub ? "Subscribed ✓" : "Subscribe"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cast;