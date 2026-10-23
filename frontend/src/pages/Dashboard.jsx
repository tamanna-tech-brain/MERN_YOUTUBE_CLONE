import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMovies, getCategories } from "../api/api";
import VideoCard from "../components/VideoCard";
import { AuthContext } from "../context/AuthContext";
import { Sparkles, Flame, Play, ChevronRight, Video, Compass, Plus } from "lucide-react";

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([{ _id: "all", name: "All" }]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { sidebarOpen } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
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

        const movieRes = await getMovies({ limit: 50 }).catch(() => null);
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
              categoryName: catObj?.name || m.category?.name || "Entertainment",
              categoryId: catObj?._id || m.categoryId,
              cast: m.cast || [],
            };
          });
        }

        setVideos(liveMovies);
      } catch (err) {
        console.error("Dashboard feed load error:", err);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredVideos =
    selectedCategory === "all"
      ? videos
      : videos.filter((v) => {
          if (v.categoryId === selectedCategory) return true;
          if (Array.isArray(v.categoryId) && v.categoryId.some(c => (c._id || c) === selectedCategory)) return true;
          if (v.categoryName && v.categoryName.toLowerCase().includes(selectedCategory.toLowerCase())) return true;
          return false;
        });

  return (
    <div
      className={`min-h-screen bg-[#0f0f0f] text-[#f1f1f1] pt-16 transition-all duration-200 pb-16 ${
        sidebarOpen ? "md:ml-60" : "md:ml-[72px]"
      }`}
    >
      <div className="sticky top-14 z-30 bg-[#0f0f0f]/95 backdrop-blur-md px-4 py-3 border-b border-[#272727]/80">
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat._id;
            return (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[#f1f1f1] text-[#0f0f0f]"
                    : "bg-[#272727] text-[#f1f1f1] hover:bg-[#383838]"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 sm:p-6 max-w-[1920px] mx-auto space-y-8">
        {videos.length > 0 && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1f1f1f] via-[#141414] to-[#0f0f0f] border border-[#272727] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
            <div className="max-w-xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-[#ff4e4e] text-xs font-bold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 fill-[#ff4e4e]" />
                Featured Video
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight capitalize leading-tight">
                {videos[0]?.title}
              </h1>
              <p className="text-xs sm:text-sm text-[#aaaaaa] line-clamp-2 leading-relaxed">
                {videos[0]?.description}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate(`/movie/${videos[0]?._id}`)}
                  className="px-5 py-2.5 bg-white text-black hover:bg-neutral-200 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition transform active:scale-95 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-black text-black" />
                  <span>Watch Now</span>
                </button>
                <button
                  onClick={() => navigate("/movies")}
                  className="px-5 py-2.5 bg-[#272727] hover:bg-[#383838] text-white rounded-full font-semibold text-xs sm:text-sm flex items-center gap-2 border border-[#383838] transition cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>Browse All</span>
                </button>
              </div>
            </div>

            <div
              onClick={() => navigate(`/movie/${videos[0]?._id}`)}
              className="w-full md:w-[380px] aspect-video rounded-xl overflow-hidden border border-[#383838] shadow-lg cursor-pointer group relative flex-shrink-0 bg-[#212121]"
            >
              {videos[0]?.poster ? (
                <img
                  src={videos[0]?.poster}
                  alt="Spotlight"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900 text-white font-bold text-lg">
                  {videos[0]?.title}
                </div>
              )}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                  <Play className="w-5 h-5 ml-1 fill-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-[#ff0000]" />
              <span>Recommended Feed</span>
            </h2>
            <Link
              to="/movies"
              className="text-xs font-semibold text-[#3ea6ff] hover:underline flex items-center gap-1"
            >
              See all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="animate-pulse space-y-3">
                  <div className="aspect-video bg-[#272727] rounded-xl"></div>
                  <div className="flex gap-3">
                    <div className="w-9 h-9 bg-[#272727] rounded-full flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-[#272727] rounded w-3/4"></div>
                      <div className="h-3 bg-[#272727] rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="text-center py-16 bg-[#181818] rounded-2xl border border-[#272727] p-8 max-w-lg mx-auto">
              <span className="text-5xl mb-3 block">🎬</span>
              <h3 className="text-lg font-bold text-white">No videos uploaded yet</h3>
              <p className="text-xs text-[#aaaaaa] mt-1 mb-5">
                Upload your first video to start building your channel!
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link
                  to="/movie/create"
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload Video</span>
                </Link>
                {selectedCategory !== "all" && (
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="px-4 py-2 bg-[#272727] hover:bg-[#383838] text-white rounded-full text-xs font-semibold transition"
                  >
                    Reset Filter
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
              {filteredVideos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
