import { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { io } from "socket.io-client";
import {
  getMovieById,
  getMovies,
  watchMovie,
  downloadMovie,
  getServerUrl,
  likeMovie,
  dislikeMovie,
  getComments,
  createComment,
  toggleSubscription,
  checkSubscription,
  getVideoStreamUrl
} from "../api/api";
import { AuthContext } from "../context/AuthContext";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  Bookmark,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Check,
  Settings,
  PictureInPicture2,
  Maximize,
  Sparkles,
  Tv,
  Clock,
  RotateCcw
} from "lucide-react";
import noImage from "../assets/no-image.jpg";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, username } = useContext(AuthContext);

  const videoRef = useRef(null);
  const socketRef = useRef(null);

  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentInputActive, setCommentInputActive] = useState(false);

  // Advanced Player Features
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [videoQuality, setVideoQuality] = useState("Auto");
  const [showSettings, setShowSettings] = useState(false);
  const [theatreMode, setTheatreMode] = useState(false);
  const [resumeNotification, setResumeNotification] = useState("");

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        setError("");

        let apiMovie = null;
        try {
          const res = await getMovieById(id);
          if (res?.data?.data) {
            apiMovie = res.data.data;
          }
        } catch (err) {
          console.debug(err);
        }

        if (!apiMovie) {
          setError("Video not found in database.");
          setLoading(false);
          return;
        }

        const firstCast = Array.isArray(apiMovie.cast) && apiMovie.cast[0] ? apiMovie.cast[0] : null;
        const normalizedMovie = {
          ...apiMovie,
          poster: apiMovie.poster || firstCast?.image || "",
          channelName: apiMovie.userId?.username || firstCast?.name || "Official Creator",
          channelAvatar: firstCast?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
          subscribers: "1.25M subscribers",
        };

        setMovie(normalizedMovie);

        const initialLikes = Array.isArray(apiMovie.likes) ? apiMovie.likes.length : 0;
        setLikeCount(initialLikes);

        const currentUserId = localStorage.getItem("userId");
        if (currentUserId && Array.isArray(apiMovie.likes)) {
          setUserLiked(apiMovie.likes.some(u => (u._id || u) === currentUserId));
        }
        if (currentUserId && Array.isArray(apiMovie.dislikes)) {
          setUserDisliked(apiMovie.dislikes.some(u => (u._id || u) === currentUserId));
        }

        if (apiMovie._id && isLoggedIn && localStorage.getItem("token")) {
          watchMovie(apiMovie._id).catch(() => {});
        }

        const channelTarget = firstCast?._id || apiMovie.userId?._id || apiMovie.userId;
        if (channelTarget && isLoggedIn && localStorage.getItem("token")) {
          try {
            const subRes = await checkSubscription(channelTarget);
            if (subRes?.data?.data) {
              setIsSubscribed(Boolean(subRes.data.data.isSubscribed));
            }
          } catch (err) {
            console.debug(err);
          }
        }

        if (apiMovie._id) {
          try {
            const commentRes = await getComments(apiMovie._id);
            if (commentRes?.data?.data && commentRes.data.data.length > 0) {
              const mapped = commentRes.data.data.map((c) => ({
                id: c._id,
                author: c.userId?.username || "Viewer",
                avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${c.userId?.username || "Viewer"}`,
                timeAgo: new Date(c.createdAt).toLocaleDateString(),
                text: c.text,
                likes: c.likes?.length || 0,
                userLiked: false,
              }));
              setComments(mapped);
            } else {
              setComments([]);
            }
          } catch (err) {
            console.debug(err);
            setComments([]);
          }
        }

        const recsRes = await getMovies({ limit: 15 }).catch(() => null);
        if (recsRes?.data?.data) {
          const recs = recsRes.data.data
            .filter((v) => v._id !== apiMovie._id)
            .map((m) => {
              const fCast = Array.isArray(m.cast) && m.cast[0] ? m.cast[0] : null;
              return {
                _id: m._id,
                title: m.title,
                description: m.description,
                poster: m.poster || fCast?.image || "",
                video: m.video,
                durationFormatted: m.duration ? `${m.duration}m` : "HD",
                views: "Verified",
                uploadedAt: new Date(m.createdAt || Date.now()).toLocaleDateString(),
                channelName: m.userId?.username || fCast?.name || "Official Channel",
              };
            });
          setRecommendations(recs);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load video details.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id, isLoggedIn]);

  // Real-Time Socket Connection for Live Comments
  useEffect(() => {
    if (!id) return;
    try {
      const socket = io(getServerUrl(), {
        transports: ["websocket", "polling"],
        reconnectionAttempts: 3,
      });
      socketRef.current = socket;
      socket.emit("join-video", id);

      socket.on("comment-received", (cData) => {
        if (!cData) return;
        setComments((prev) => {
          if (prev.some((c) => (c.id || c._id) === (cData._id || cData.id))) return prev;
          const formatted = {
            id: cData._id || cData.id || `c_${Date.now()}`,
            author: cData.userId?.username || cData.author || "Viewer",
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${cData.userId?.username || "Viewer"}`,
            timeAgo: "Just now (Live)",
            text: cData.text,
            likes: 0,
            userLiked: false,
          };
          return [formatted, ...prev];
        });
      });

      return () => {
        socket.emit("leave-video", id);
        socket.disconnect();
      };
    } catch (e) {
      console.warn("Socket init error:", e);
    }
  }, [id]);

  // Keyboard Shortcuts (Space, F, M, J, L, 0-9)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
      if (!videoRef.current) return;

      if (e.code === "Space" || e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (videoRef.current.paused) videoRef.current.play();
        else videoRef.current.pause();
      } else if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        if (document.fullscreenElement) document.exitFullscreen();
        else videoRef.current.requestFullscreen?.();
      } else if (e.key.toLowerCase() === "m") {
        e.preventDefault();
        videoRef.current.muted = !videoRef.current.muted;
      } else if (e.key.toLowerCase() === "j" || e.code === "ArrowLeft") {
        e.preventDefault();
        videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
      } else if (e.key.toLowerCase() === "l" || e.code === "ArrowRight") {
        e.preventDefault();
        videoRef.current.currentTime = Math.min(videoRef.current.duration || 9999, videoRef.current.currentTime + 10);
      } else if (!isNaN(parseInt(e.key)) && parseInt(e.key) >= 0 && parseInt(e.key) <= 9) {
        e.preventDefault();
        const fraction = parseInt(e.key) / 10;
        if (videoRef.current.duration) {
          videoRef.current.currentTime = videoRef.current.duration * fraction;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    const savedTime = localStorage.getItem(`yt_progress_${id}`);
    if (savedTime) {
      const parsed = parseFloat(savedTime);
      if (parsed > 5 && parsed < (videoRef.current.duration || 9999) - 5) {
        videoRef.current.currentTime = parsed;
        const mins = Math.floor(parsed / 60);
        const secs = Math.floor(parsed % 60);
        setResumeNotification(`Resumed from ${mins}:${secs < 10 ? "0" : ""}${secs}`);
        setTimeout(() => setResumeNotification(""), 4500);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.currentTime) {
      localStorage.setItem(`yt_progress_${id}`, videoRef.current.currentTime);
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSettings(false);
  };

  const handleTogglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.warn("PiP error:", err);
    }
  };

  const handleSubscribe = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    const channelTarget = movie?.cast?.[0]?._id || movie?.userId || movie?._id;
    if (!channelTarget) return;

    try {
      const res = await toggleSubscription(channelTarget);
      if (res?.data?.data) {
        setIsSubscribed(Boolean(res.data.data.isSubscribed));
      } else {
        setIsSubscribed(!isSubscribed);
      }
    } catch {
      setIsSubscribed(!isSubscribed);
    }
  };

  const handleLike = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (!movie?._id) return;

    try {
      const res = await likeMovie(movie._id);
      if (res?.data?.data) {
        setLikeCount(res.data.data.likeCount);
        setUserLiked(res.data.data.userLiked);
        setUserDisliked(res.data.data.userDisliked);
      } else {
        setUserLiked(!userLiked);
        setLikeCount((prev) => (userLiked ? prev - 1 : prev + 1));
        if (userDisliked) setUserDisliked(false);
      }
    } catch {
      setUserLiked(!userLiked);
      setLikeCount((prev) => (userLiked ? prev - 1 : prev + 1));
      if (userDisliked) setUserDisliked(false);
    }
  };

  const handleDislike = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (!movie?._id) return;

    try {
      const res = await dislikeMovie(movie._id);
      if (res?.data?.data) {
        setLikeCount(res.data.data.likeCount);
        setUserLiked(res.data.data.userLiked);
        setUserDisliked(res.data.data.userDisliked);
      } else {
        setUserDisliked(!userDisliked);
        if (userLiked) {
          setUserLiked(false);
          setLikeCount((prev) => prev - 1);
        }
      }
    } catch {
      setUserDisliked(!userDisliked);
      if (userLiked) {
        setUserLiked(false);
        setLikeCount((prev) => prev - 1);
      }
    }
  };

  const handleDownload = async () => {
    if (!movie) return;
    try {
      await downloadMovie(movie._id);
      setIsDownloaded(true);
      alert("Video saved to your Downloads!");
    } catch {
      setIsDownloaded(true);
      alert("Video saved to your Downloads!");
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    alert("Video link copied to clipboard!");
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      const res = await createComment(movie._id, newComment.trim());
      const cData = res?.data?.data;
      const added = {
        id: cData?._id || `c_${Date.now()}`,
        author: username || "You",
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${username || "You"}`,
        timeAgo: "Just now",
        text: newComment.trim(),
        likes: 0,
        userLiked: false,
      };
      setComments([added, ...comments]);
    } catch {
      const added = {
        id: `c_${Date.now()}`,
        author: username || "You",
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${username || "You"}`,
        timeAgo: "Just now",
        text: newComment.trim(),
        likes: 0,
        userLiked: false,
      };
      setComments([added, ...comments]);
    }

    setNewComment("");
    setCommentInputActive(false);
  };

  const getEmbedYouTubeUrl = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : null;
  };

  const getPosterUrl = (posterPath) => {
    if (!posterPath) return movie?.cast?.[0]?.image || noImage;
    if (posterPath.startsWith("/uploads")) {
      return `${getServerUrl()}${posterPath}`;
    }
    return posterPath;
  };

  const getVideoSource = () => {
    if (!movie) return "";
    if (movie._id && movie.video) {
      return getVideoStreamUrl(movie._id);
    }
    if (movie.video) {
      if (movie.video.startsWith("/uploads")) {
        return `${getServerUrl()}${movie.video}`;
      }
      return movie.video;
    }
    return "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] pt-20 flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#ff0000] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-[#aaaaaa] font-medium tracking-wide">Loading video player...</span>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] pt-24 text-center px-4">
        <span className="text-5xl mb-4 block">📺</span>
        <h2 className="text-xl font-bold text-white mb-2">Video Unavailable</h2>
        <p className="text-sm text-[#aaaaaa] mb-6">{error || "This video could not be loaded."}</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2.5 bg-[#272727] hover:bg-[#383838] text-white rounded-full font-medium text-sm transition"
        >
          Go Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#f1f1f1] pt-16 pb-16 px-3 sm:px-6">
      <div className={`max-w-[1720px] mx-auto grid grid-cols-1 ${theatreMode ? "lg:grid-cols-1" : "lg:grid-cols-12"} gap-6 pt-2`}>
        <div className={`${theatreMode ? "lg:col-span-12" : "lg:col-span-8"} space-y-4`}>
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-[#272727] group">
            {resumeNotification && (
              <div className="absolute top-4 left-4 z-30 bg-black/85 backdrop-blur-md text-white text-xs px-3.5 py-1.5 rounded-full flex items-center gap-2 border border-[#3ea6ff]/40 shadow-lg">
                <Clock className="w-3.5 h-3.5 text-[#3ea6ff]" />
                <span className="font-medium">{resumeNotification}</span>
              </div>
            )}
            {getEmbedYouTubeUrl(movie.video) ? (
              <iframe
                src={getEmbedYouTubeUrl(movie.video)}
                title={movie.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <video
                ref={videoRef}
                src={getVideoSource()}
                poster={getPosterUrl(movie.poster)}
                controls
                autoPlay
                playsInline
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Pro Player Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#181818] border border-[#272727] rounded-xl px-4 py-2 text-xs">
            <div className="flex items-center gap-2 text-[#aaaaaa]">
              <span className="flex items-center gap-1.5 font-medium text-white">
                <Sparkles className="w-3.5 h-3.5 text-[#ff0000]" />
                Pro Player Controls
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline text-[11px] text-[#717171]">
                Hotkeys: Space (Play/Pause) • F (Fullscreen) • M (Mute) • J/L (Seek 10s)
              </span>
            </div>

            <div className="flex items-center gap-2 relative">
              {/* Playback Speed Switcher */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center gap-1 bg-[#272727] hover:bg-[#383838] text-white px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer"
                  title="Playback Speed"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>{playbackSpeed}x</span>
                </button>
                {showSettings && (
                  <div className="absolute right-0 bottom-full mb-2 bg-[#212121] border border-[#383838] rounded-xl shadow-2xl py-1.5 w-32 z-50">
                    <span className="px-3 py-1 text-[10px] uppercase tracking-wider text-[#aaaaaa] block font-bold">Speed</span>
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleSpeedChange(s)}
                        className={`w-full text-left px-3 py-1 text-xs hover:bg-[#383838] flex items-center justify-between ${playbackSpeed === s ? "text-[#ff0000] font-bold" : "text-white"}`}
                      >
                        <span>{s === 1 ? "Normal (1x)" : `${s}x`}</span>
                        {playbackSpeed === s && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quality Switcher */}
              <select
                value={videoQuality}
                onChange={(e) => setVideoQuality(e.target.value)}
                className="bg-[#272727] hover:bg-[#383838] text-white px-2 py-1 rounded-lg text-xs font-medium outline-none cursor-pointer"
                title="Video Quality"
              >
                <option value="Auto">HD (Auto)</option>
                <option value="1080p">1080p HD</option>
                <option value="720p">720p</option>
                <option value="480p">480p</option>
              </select>

              {/* Picture-in-Picture Button */}
              <button
                type="button"
                onClick={handleTogglePiP}
                className="p-1.5 bg-[#272727] hover:bg-[#383838] text-white rounded-lg text-xs transition cursor-pointer"
                title="Picture in Picture (PiP)"
              >
                <PictureInPicture2 className="w-3.5 h-3.5" />
              </button>

              {/* Theatre Mode Toggle */}
              <button
                type="button"
                onClick={() => setTheatreMode(!theatreMode)}
                className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${theatreMode ? "bg-[#ff0000] text-white" : "bg-[#272727] hover:bg-[#383838] text-white"}`}
                title="Toggle Theatre Mode"
              >
                <Tv className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight capitalize tracking-tight">
            {movie.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#272727]">
            <div className="flex items-center gap-3.5">
              <Link
                to={movie.cast?.[0]?._id ? `/cast/${movie.cast[0]._id}` : "#"}
                className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-[#383838] hover:opacity-90 transition"
              >
                <img
                  src={movie.channelAvatar || movie.cast?.[0]?.image || movie.cast?.[0]?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
                  alt={movie.channelName || "Creator"}
                  className="w-full h-full object-cover"
                />
              </Link>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-white hover:underline cursor-pointer">
                    {movie.channelName || movie.cast?.[0]?.name || "Official Channel"}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#aaaaaa]" />
                </div>
                <span className="text-xs text-[#aaaaaa]">
                  {movie.subscribers || "1.25M subscribers"}
                </span>
              </div>

              <button
                onClick={handleSubscribe}
                className={`ml-3 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  isSubscribed
                    ? "bg-[#272727] text-white hover:bg-[#383838]"
                    : "bg-white text-black hover:bg-neutral-200"
                }`}
              >
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <div className="flex items-center bg-[#272727] hover:bg-[#383838] rounded-full text-xs font-semibold overflow-hidden">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 px-3.5 py-2 hover:bg-[#404040] transition border-r border-[#383838] cursor-pointer ${
                    userLiked ? "text-[#3ea6ff]" : "text-white"
                  }`}
                  title="I like this"
                >
                  <ThumbsUp className={`w-4 h-4 ${userLiked ? "fill-[#3ea6ff]" : ""}`} />
                  <span>{likeCount >= 1000 ? `${(likeCount / 1000).toFixed(1)}K` : likeCount}</span>
                </button>
                <button
                  onClick={handleDislike}
                  className={`px-3 py-2 hover:bg-[#404040] transition cursor-pointer ${
                    userDisliked ? "text-[#3ea6ff]" : "text-white"
                  }`}
                  title="I dislike this"
                >
                  <ThumbsDown className={`w-4 h-4 ${userDisliked ? "fill-[#3ea6ff]" : ""}`} />
                </button>
              </div>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#272727] hover:bg-[#383838] rounded-full text-xs font-semibold text-white transition cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#272727] hover:bg-[#383838] rounded-full text-xs font-semibold text-white transition cursor-pointer"
              >
                {isDownloaded ? <Check className="w-4 h-4 text-green-400" /> : <Download className="w-4 h-4" />}
                <span className="hidden sm:inline">{isDownloaded ? "Downloaded" : "Download"}</span>
              </button>

              <button
                onClick={() => alert("Added to your Watchlist!")}
                className="p-2 bg-[#272727] hover:bg-[#383838] rounded-full text-white transition cursor-pointer"
                title="Save video"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            onClick={() => setDescExpanded(!descExpanded)}
            className="bg-[#212121] hover:bg-[#282828] transition rounded-2xl p-4 text-sm cursor-pointer select-none space-y-2"
          >
            <div className="flex flex-wrap items-center gap-3 font-semibold text-white text-xs">
              <span>{movie.views || "1.2M views"}</span>
              <span>•</span>
              <span>{movie.uploadedAt || (movie.releaseYear ? `${movie.releaseYear}` : "Recently released")}</span>
              {movie.categoryName && (
                <span className="text-[#3ea6ff]">#{movie.categoryName.replace(/\s+/g, "").toLowerCase()}</span>
              )}
            </div>

            <p className={`text-neutral-300 leading-relaxed ${descExpanded ? "" : "line-clamp-2"}`}>
              {movie.description || "No detailed description provided for this video."}
            </p>

            {movie.cast && movie.cast.length > 0 && (
              <div className="pt-2 border-t border-[#303030]">
                <span className="text-xs font-bold text-[#aaaaaa] block mb-2">Featured Creators / Cast:</span>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map((c, idx) => (
                    <span
                      key={c._id || idx}
                      className="inline-flex items-center gap-1.5 bg-[#2c2c2c] px-3 py-1 rounded-full text-xs text-white"
                    >
                      <span>🎬</span>
                      <span>{c.name || c}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button className="text-xs font-bold text-white hover:underline pt-1 flex items-center gap-1">
              {descExpanded ? (
                <>Show less <ChevronUp className="w-3.5 h-3.5" /></>
              ) : (
                <>...more <ChevronDown className="w-3.5 h-3.5" /></>
              )}
            </button>
          </div>

          <div className="pt-4 space-y-6">
            <div className="flex items-center gap-6">
              <h3 className="text-lg font-bold text-white">
                {comments.length} Comments
              </h3>
              <span className="text-xs text-[#aaaaaa] font-medium flex items-center gap-1 cursor-pointer hover:text-white">
                Sort by
              </span>
            </div>

            <form onSubmit={handleAddComment} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#cc0000] text-white font-bold flex items-center justify-center flex-shrink-0 text-sm">
                {username ? username.charAt(0).toUpperCase() : "U"}
              </div>

              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onFocus={() => setCommentInputActive(true)}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full bg-transparent border-b border-[#383838] focus:border-white outline-none pb-1.5 text-sm text-white placeholder-[#717171] transition"
                />

                {commentInputActive && (
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setNewComment("");
                        setCommentInputActive(false);
                      }}
                      className="px-4 py-1.5 hover:bg-[#272727] text-white rounded-full text-xs font-semibold transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="px-4 py-1.5 bg-[#3ea6ff] disabled:bg-[#272727] text-black disabled:text-[#717171] rounded-full text-xs font-semibold transition"
                    >
                      Comment
                    </button>
                  </div>
                )}
              </div>
            </form>

            <div className="space-y-5">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3.5">
                  <img
                    src={comment.avatar}
                    alt={comment.author}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-1 ring-[#383838]"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{comment.author}</span>
                      <span className="text-[11px] text-[#aaaaaa]">{comment.timeAgo}</span>
                    </div>
                    <p className="text-sm text-[#f1f1f1] leading-relaxed">{comment.text}</p>
                    <div className="flex items-center gap-3 pt-1 text-xs text-[#aaaaaa]">
                      <button className="flex items-center gap-1 hover:text-white transition">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{comment.likes || ""}</span>
                      </button>
                      <button className="hover:text-white transition">
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                      <button className="font-semibold hover:text-white transition text-[11px]">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h3 className="font-bold text-base text-white">Up Next</h3>
            <span className="text-xs text-[#3ea6ff] font-medium cursor-pointer hover:underline">
              Autoplay ON
            </span>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div
                key={rec._id}
                onClick={() => navigate(`/movie/${rec._id}`)}
                className="flex gap-3 group cursor-pointer p-1 rounded-xl hover:bg-[#212121] transition"
              >
                <div className="relative w-40 aspect-video rounded-lg overflow-hidden bg-[#272727] flex-shrink-0">
                  <img
                    src={rec.poster}
                    alt={rec.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/85 text-white text-[10px] font-semibold px-1 rounded">
                    {rec.durationFormatted || "15:00"}
                  </span>
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <h4
                    className="text-xs font-semibold text-white group-hover:text-[#3ea6ff] line-clamp-2 leading-tight"
                    title={rec.title}
                  >
                    {rec.title}
                  </h4>
                  <div className="text-[11px] text-[#aaaaaa] mt-1 space-y-0.5">
                    <p className="truncate flex items-center gap-1">
                      {rec.channelName}
                      <CheckCircle2 className="w-3 h-3 text-[#aaaaaa]" />
                    </p>
                    <p>{rec.views} • {rec.uploadedAt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;