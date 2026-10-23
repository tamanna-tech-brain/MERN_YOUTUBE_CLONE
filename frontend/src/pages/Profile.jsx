import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { getUserById, updateUserById, getMovies } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import VideoCard from "../components/VideoCard";
import { CheckCircle2, Settings, Plus, LogOut, Check, AlertCircle } from "lucide-react";

const Profile = () => {
  const { id } = useParams();
  const { sidebarOpen, logout, username: ctxUser, userId: currentUserId } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState(ctxUser || "User");
  const [email, setEmail] = useState("");
  const [userVideos, setUserVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("videos");

  useEffect(() => {
    const fetchUserAndVideos = async () => {
      try {
        setLoading(true);
        if (id && id !== "me") {
          const res = await getUserById(id).catch(() => null);
          if (res?.data?.data) {
            setUsername(res.data.data.username);
            setEmail(res.data.data.email);
          }
        }

        const moviesRes = await getMovies({ limit: 50 }).catch(() => null);
        if (moviesRes?.data?.data) {
          const effectiveUserId = (id && id !== "me") ? id : currentUserId;
          const filtered = moviesRes.data.data
            .filter((m) => {
              if (!effectiveUserId) return true;
              return (m.userId?._id || m.userId) === effectiveUserId;
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
                channelName: m.userId?.username || firstCast?.name || "Official Channel",
                channelAvatar: firstCast?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
              };
            });
          setUserVideos(filtered.length > 0 ? filtered : moviesRes.data.data.map((m) => {
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
              channelName: m.userId?.username || firstCast?.name || "Official Channel",
              channelAvatar: firstCast?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
            };
          }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndVideos();
  }, [id, currentUserId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username.trim()) {
      setError("Username cannot be empty");
      return;
    }

    try {
      setSaving(true);
      if (id && id !== "me") {
        await updateUserById(id, { username, email });
      }
      localStorage.setItem("username", username);
      setSuccess("Channel profile updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] pt-24 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-[#ff0000] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-[#0f0f0f] text-[#f1f1f1] pt-14 pb-16 transition-all duration-200 ${
        sidebarOpen ? "md:ml-60" : "md:ml-[72px]"
      }`}
    >
      
      <div className="h-40 sm:h-56 w-full bg-gradient-to-r from-red-950/60 via-[#181818] to-purple-950/40 relative overflow-hidden border-b border-[#272727]">
        <img
          src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&auto=format&fit=crop&q=80"
          alt="Banner"
          className="w-full h-full object-cover opacity-25 pointer-events-none"
        />
      </div>

      <div className="max-w-[1720px] mx-auto px-4 sm:px-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 py-6 border-b border-[#272727]">
          <div className="flex items-center gap-5">
            <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-gradient-to-tr from-[#cc0000] to-[#ff4e45] text-white font-black text-3xl sm:text-4xl flex items-center justify-center ring-4 ring-[#0f0f0f] shadow-2xl flex-shrink-0">
              {username ? username.charAt(0).toUpperCase() : "U"}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {username}
                </h1>
                <CheckCircle2 className="w-5 h-5 text-[#3ea6ff]" />
              </div>
              <p className="text-xs text-[#aaaaaa] mt-1">
                @{username.toLowerCase().replace(/\s+/g, "")} • 14.2K subscribers • 8 videos
              </p>
              <p className="text-xs text-[#717171] mt-1">
                Official YouTube channel profile • Created with MERN Stack
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <button
              onClick={() => navigate("/movie/create")}
              className="flex items-center gap-2 px-4 py-2 bg-[#ff0000] hover:bg-[#cc0000] text-white rounded-full text-xs font-bold transition shadow-lg shadow-red-600/10 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Video</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-[#272727] hover:bg-[#383838] text-[#ff4e45] rounded-full text-xs font-semibold transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
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
            Your Channel Videos
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`py-3 border-b-2 transition cursor-pointer ${
              activeTab === "settings"
                ? "border-white text-white"
                : "border-transparent text-[#aaaaaa] hover:text-white"
            }`}
          >
            Channel Customization & Settings
          </button>
        </div>

        
        <div className="pt-6">
          {activeTab === "videos" ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-base text-white">Uploads</h3>
                <span className="text-xs text-[#aaaaaa]">{userVideos.length} videos</span>
              </div>
              {userVideos.length === 0 ? (
                <div className="text-center py-16 bg-[#181818] rounded-2xl border border-[#272727] p-8 max-w-md mx-auto">
                  <span className="text-4xl mb-3 block">📹</span>
                  <h4 className="text-sm font-bold text-white">No uploaded videos yet</h4>
                  <p className="text-xs text-[#aaaaaa] mt-1 mb-4">Start creating videos to see them listed here.</p>
                  <Link
                    to="/movie/create"
                    className="inline-block px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-semibold transition"
                  >
                    Upload Video
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
                  {userVideos.map((v) => (
                    <VideoCard key={v._id} video={v} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-xl bg-[#181818] border border-[#272727] p-6 rounded-2xl space-y-5">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#3ea6ff]" />
                <span>Channel Details & Credentials</span>
              </h3>

              {error && (
                <div className="p-3 bg-red-600/15 border border-red-500/30 text-[#ff4e45] rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-600/15 border border-green-500/30 text-green-400 rounded-xl text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Channel Display Name
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full bg-[#121212] border border-[#303030] focus:border-[#3ea6ff] rounded-xl p-3 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="creator@youtube.com"
                    className="w-full bg-[#121212] border border-[#303030] focus:border-[#3ea6ff] rounded-xl p-3 text-sm text-white outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-[#3ea6ff] hover:bg-[#2088df] text-black font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    {saving ? "Saving Changes..." : "Save Channel Profile"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;