import { useEffect, useState, useContext } from "react";
import { getCastById, getMovies, getServerUrl } from "../api/api";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import VideoCard from "../components/VideoCard";
import { CheckCircle2, Tv, Bell, Share2, Film } from "lucide-react";

const CastDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sidebarOpen } = useContext(AuthContext);

  const [cast, setCast] = useState(null);
  const [creatorVideos, setCreatorVideos] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("videos");

  useEffect(() => {
    const fetchCast = async () => {
      try {
        setLoading(true);

        let apiCast = null;
        try {
          const res = await getCastById(id);
          if (res?.data?.data) {
            apiCast = res.data.data;
          }
        } catch (err) {
          console.debug(err);
        }

        if (apiCast) {
          setCast(apiCast);

          const moviesRes = await getMovies({ limit: 50 }).catch(() => null);
          if (moviesRes?.data?.data) {
            const related = moviesRes.data.data
              .filter((m) => {
                if (Array.isArray(m.cast)) {
                  return m.cast.some((c) => (c._id || c) === apiCast._id || (c.name && c.name.toLowerCase() === apiCast.name?.toLowerCase()));
                }
                return false;
              })
              .map((m) => {
                const firstCast = Array.isArray(m.cast) && m.cast[0] ? m.cast[0] : null;
                return {
                  _id: m._id,
                  title: m.title,
                  description: m.description,
                  poster: m.poster || firstCast?.image || "",
                  video: m.video,
                  duration: m.duration || 180,
                  views: "Verified",
                  uploadedAt: new Date(m.createdAt || Date.now()).toLocaleDateString(),
                  channelName: apiCast.name,
                  channelAvatar: apiCast.image || apiCast.avatar,
                };
              });
            setCreatorVideos(related);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCast();
  }, [id]);

  const getCastUrl = (imagePath) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80";
    if (imagePath.startsWith("/uploads")) {
      return `${getServerUrl()}${imagePath}`;
    }
    return imagePath;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] pt-20 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-[#ff0000] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!cast) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] pt-24 text-center px-4">
        <h2 className="text-xl font-bold text-white mb-2">Channel Not Found</h2>
        <button
          onClick={() => navigate("/cast")}
          className="mt-4 px-6 py-2 bg-[#272727] text-white rounded-full text-xs font-semibold"
        >
          Return to Creators
        </button>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-[#0f0f0f] text-[#f1f1f1] pt-14 pb-16 transition-all duration-200 ${
        sidebarOpen ? "md:ml-60" : "md:ml-[72px]"
      }`}
    >
      
      <div className="h-44 sm:h-64 w-full bg-gradient-to-r from-red-900/40 via-neutral-900 to-purple-900/30 relative overflow-hidden border-b border-[#272727]">
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80"
          alt="Channel Banner"
          className="w-full h-full object-cover opacity-30 pointer-events-none"
        />
      </div>

      <div className="max-w-[1720px] mx-auto px-4 sm:px-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 py-6 border-b border-[#272727]">
          <div className="flex items-center gap-5">
            <img
              src={getCastUrl(cast.image || cast.avatar)}
              alt={cast.name}
              className="w-20 sm:w-28 h-20 sm:h-28 rounded-full object-cover ring-4 ring-[#0f0f0f] shadow-2xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {cast.name}
                </h1>
                <CheckCircle2 className="w-5 h-5 text-[#3ea6ff]" />
              </div>
              <p className="text-xs text-[#aaaaaa] mt-1">
                @{cast.name?.toLowerCase().replace(/\s+/g, "")} • {cast.subscribers || "1.2M"} subscribers • {creatorVideos.length} videos
              </p>
              <p className="text-xs text-[#717171] mt-2 max-w-xl line-clamp-2">
                {cast.bio || "Welcome to the official channel! New videos released weekly covering industry breakdowns and filmmaking."}
              </p>
            </div>
          </div>

          
          <div className="flex items-center gap-3 self-end sm:self-center">
            <button
              onClick={() => setIsSubscribed(!isSubscribed)}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer ${
                isSubscribed
                  ? "bg-[#272727] text-white hover:bg-[#383838]"
                  : "bg-white text-black hover:bg-neutral-200"
              }`}
            >
              {isSubscribed ? "Subscribed ✓" : "Subscribe"}
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert("Channel link copied! 📋");
              }}
              className="p-2.5 rounded-full bg-[#272727] hover:bg-[#383838] text-white transition"
              title="Share channel"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        
        <div className="flex items-center gap-8 border-b border-[#272727] text-sm font-semibold">
          <button
            onClick={() => setActiveTab("videos")}
            className={`py-3 border-b-2 transition cursor-pointer ${
              activeTab === "videos"
                ? "border-white text-white"
                : "border-transparent text-[#aaaaaa] hover:text-white"
            }`}
          >
            Videos ({creatorVideos.length})
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`py-3 border-b-2 transition cursor-pointer ${
              activeTab === "about"
                ? "border-white text-white"
                : "border-transparent text-[#aaaaaa] hover:text-white"
            }`}
          >
            About
          </button>
        </div>

        
        <div className="pt-6">
          {activeTab === "videos" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
              {creatorVideos.map((v) => (
                <VideoCard key={v._id} video={v} />
              ))}
            </div>
          ) : (
            <div className="max-w-2xl bg-[#181818] p-6 rounded-2xl border border-[#272727] space-y-4 text-xs">
              <h3 className="text-base font-bold text-white">Channel Details</h3>
              <p className="text-neutral-300 leading-relaxed">
                {cast.bio || "No detailed bio provided."}
              </p>
              <div className="pt-4 border-t border-[#272727] space-y-2 text-[#aaaaaa]">
                <p>Joined YouTube: March 2024</p>
                <p>Verified Creator Badge: Active</p>
                <p>Total Channel Views: 24.5M</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CastDetails;