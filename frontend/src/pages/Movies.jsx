import { useEffect, useState, useContext } from "react";
import { getMovies, getCategories } from "../api/api";
import { useLocation, useNavigate } from "react-router-dom";
import VideoCard from "../components/VideoCard";
import { AuthContext } from "../context/AuthContext";
import { Search, Compass, Plus, SlidersHorizontal } from "lucide-react";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([{ _id: "all", name: "All" }]);
  const [sortBy, setSortBy] = useState("latest");
  const [loading, setLoading] = useState(false);

  const { sidebarOpen } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search");
    const cat = params.get("category");
    if (q) setSearchText(q);
    if (cat) setSelectedCategory(cat);
  }, [location.search]);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);

        const catRes = await getCategories({ limit: 50 }).catch(() => null);
        if (catRes?.data?.data && catRes.data.data.length > 0) {
          const apiCats = catRes.data.data.map((c) => ({
            _id: c._id,
            name: c.name,
          }));
          setCategories([{ _id: "all", name: "All" }, ...apiCats]);
        }

        const movieRes = await getMovies({
          page: 1,
          limit: 100,
          search: searchText,
        }).catch(() => null);

        let liveMovies = [];
        if (movieRes?.data?.data && movieRes.data.data.length > 0) {
          liveMovies = movieRes.data.data.map((m) => {
            const firstCast = Array.isArray(m.cast) && m.cast[0] ? m.cast[0] : null;
            const catObj = Array.isArray(m.categoryId) ? m.categoryId[0] : m.categoryId;
            const posterUrl = m.poster || firstCast?.image || "";
            return {
              _id: m._id,
              title: m.title,
              description: m.description,
              poster: posterUrl,
              video: m.video,
              duration: m.duration || 180,
              releaseYear: m.releaseYear,
              views: "Verified on YT",
              uploadedAt: new Date(m.createdAt || Date.now()).toLocaleDateString(),
              channelName: m.userId?.username || firstCast?.name || "Official Channel",
              channelAvatar: firstCast?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
              categoryName: catObj?.name || m.category?.name || "General",
              categoryId: catObj?._id || m.categoryId,
              cast: m.cast || [],
            };
          });
        }

        setMovies(liveMovies);
      } catch (err) {
        console.error("Explore fetch error:", err);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [searchText]);

  const filtered = movies
    .filter((v) => {
      const matchesSearch =
        !searchText.trim() ||
        v.title.toLowerCase().includes(searchText.toLowerCase()) ||
        v.description?.toLowerCase().includes(searchText.toLowerCase()) ||
        v.channelName?.toLowerCase().includes(searchText.toLowerCase());

      const matchesCat =
        selectedCategory === "all" ||
        selectedCategory === "cat_all" ||
        v.categoryId === selectedCategory ||
        (Array.isArray(v.categoryId) && v.categoryId.some(c => (c._id || c) === selectedCategory)) ||
        (v.categoryName && v.categoryName.toLowerCase().includes(selectedCategory.toLowerCase()));

      return matchesSearch && matchesCat;
    })
    .sort((a, b) => {
      if (sortBy === "latest") return (b.releaseYear || 2026) - (a.releaseYear || 2026);
      if (sortBy === "duration") return (b.duration || 0) - (a.duration || 0);
      return 0;
    });

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
              <Compass className="w-7 h-7 text-[#ff0000]" />
              <span>Explore YouTube Videos</span>
            </h1>
            <p className="text-xs text-[#aaaaaa] mt-1">
              Discover popular trends, tutorials, movies, and original uploads
            </p>
          </div>

          <button
            onClick={() => navigate("/movie/create")}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#ff0000] hover:bg-[#cc0000] text-white rounded-full text-xs font-bold transition shadow-lg shadow-red-600/10 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Video</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717171]" />
            <input
              type="text"
              placeholder="Filter by title, channel, keywords..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full bg-[#181818] border border-[#303030] focus:border-[#3ea6ff] rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-[#717171] outline-none transition"
            />
          </div>

          <div className="flex items-center gap-2 text-xs self-end md:self-auto">
            <SlidersHorizontal className="w-4 h-4 text-[#aaaaaa]" />
            <span className="text-[#aaaaaa] font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#181818] border border-[#303030] text-white rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
            >
              <option value="latest">Latest Released</option>
              <option value="duration">Longest Duration</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() => setSelectedCategory(c._id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === c._id
                  ? "bg-[#f1f1f1] text-[#0f0f0f]"
                  : "bg-[#272727] text-[#f1f1f1] hover:bg-[#383838]"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 pt-2">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="animate-pulse space-y-3">
                <div className="aspect-video bg-[#272727] rounded-xl"></div>
                <div className="h-4 bg-[#272727] rounded w-3/4"></div>
                <div className="h-3 bg-[#272727] rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-[#181818] rounded-2xl border border-[#272727] p-8 max-w-lg mx-auto">
            <span className="text-4xl mb-3 block">🔍</span>
            <h3 className="text-base font-bold text-white">
              {searchText ? `No results matching "${searchText}"` : "No videos uploaded yet"}
            </h3>
            <p className="text-xs text-[#aaaaaa] mt-1 mb-4">
              {searchText
                ? "Try checking your spelling or use different keywords"
                : "Upload a video to make it appear on the explore page."}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => navigate("/movie/create")}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-semibold transition"
              >
                Upload Video
              </button>
              {(searchText || selectedCategory !== "all") && (
                <button
                  onClick={() => {
                    setSearchText("");
                    setSelectedCategory("all");
                  }}
                  className="px-5 py-2 bg-[#272727] hover:bg-[#383838] text-white rounded-full text-xs font-semibold transition"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 pt-2">
            {filtered.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;