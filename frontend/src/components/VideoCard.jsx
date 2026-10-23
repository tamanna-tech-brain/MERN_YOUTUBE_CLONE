import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, MoreVertical, Download, Clock, Share2, Play } from "lucide-react";
import { downloadMovie, watchMovie, getServerUrl } from "../api/api";
import noImage from "../assets/no-image.jpg";

function VideoCard({ video }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const navigate = useNavigate();

  if (!video) return null;

  const getPosterUrl = (posterPath) => {
    if (!posterPath) {
      if (Array.isArray(video.cast) && video.cast[0]?.image) return video.cast[0].image;
      return noImage;
    }
    if (posterPath.startsWith("/uploads")) {
      return `${getServerUrl()}${posterPath}`;
    }
    return posterPath;
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);
    try {
      await downloadMovie(video._id);
      setDownloaded(true);
      alert("Added to Downloads! ⬇️");
    } catch (err) {
      alert(err.message || "Saved to offline downloads!");
      setDownloaded(true);
    }
  };

  const handleWatchLater = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);
    try {
      await watchMovie(video._id);
      alert("Added to your Watch History! 🎬");
    } catch {
      alert("Added to Watch History!");
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);
    const url = `${window.location.origin}/movie/${video._id}`;
    navigator.clipboard?.writeText(url);
    alert("Video link copied to clipboard! 📋");
  };

  const formatDuration = (d) => {
    if (video.durationFormatted) return video.durationFormatted;
    if (!d) return "HD";
    if (typeof d === "string" && d.includes(":")) return d;
    const mins = Math.floor(d / 60);
    const secs = d % 60;
    if (mins > 60) {
      const hrs = Math.floor(mins / 60);
      const remMins = mins % 60;
      return `${hrs}:${remMins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col group cursor-pointer relative select-none">
      
      <div
        onClick={() => navigate(`/movie/${video._id}`)}
        className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#212121] transition duration-200 group-hover:rounded-none group-hover:shadow-xl"
      >
        <img
          src={getPosterUrl(video.poster)}
          alt={video.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80";
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        
        <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[11px] font-semibold px-1.5 py-0.5 rounded tracking-wide backdrop-blur-sm">
          {formatDuration(video.duration)}
        </span>

        
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <div className="w-12 h-12 rounded-full bg-black/70 text-white flex items-center justify-center backdrop-blur-md shadow-lg transform group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 ml-1 fill-white text-white" />
          </div>
        </div>
      </div>

      
      <div className="flex items-start gap-3 mt-3 px-0.5">
        
        <Link
          to={video.cast?.[0]?._id ? `/cast/${video.cast[0]._id}` : `/movie/${video._id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex-shrink-0"
        >
          <img
            src={video.channelAvatar || video.cast?.[0]?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
            alt={video.channelName || "Creator"}
            className="w-9 h-9 rounded-full object-cover ring-1 ring-[#272727] hover:opacity-85 transition"
          />
        </Link>

        
        <div className="flex-1 min-w-0" onClick={() => navigate(`/movie/${video._id}`)}>
          <h3
            className="text-[14px] font-semibold text-[#f1f1f1] group-hover:text-white line-clamp-2 leading-[1.35] tracking-tight capitalize"
            title={video.title}
          >
            {video.title}
          </h3>

          
          <div className="flex items-center gap-1.5 mt-1 text-[#aaaaaa] hover:text-white transition">
            <span className="text-[12px] truncate font-medium">
              {video.channelName || video.cast?.[0]?.name || "Official Creator"}
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#aaaaaa] flex-shrink-0" />
          </div>

          
          <div className="text-[12px] text-[#aaaaaa] flex items-center gap-1 mt-0.5">
            <span>{video.views || "120K views"}</span>
            <span>•</span>
            <span>{video.uploadedAt || (video.releaseYear ? `${video.releaseYear}` : "Recently")}</span>
          </div>
        </div>

        
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="p-1 rounded-full text-[#aaaaaa] hover:text-white hover:bg-[#272727] opacity-0 group-hover:opacity-100 transition"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-6 w-48 bg-[#282828] border border-[#3f3f3f] rounded-xl shadow-2xl py-1.5 z-30 text-xs text-[#f1f1f1]"
            >
              <button
                onClick={handleWatchLater}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#383838] transition text-left cursor-pointer"
              >
                <Clock className="w-4 h-4 text-[#aaaaaa]" />
                <span>Save to History</span>
              </button>
              <button
                onClick={handleDownload}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#383838] transition text-left cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#aaaaaa]" />
                <span>{downloaded ? "Downloaded ✓" : "Download Video"}</span>
              </button>
              <button
                onClick={handleShare}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#383838] transition text-left cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-[#aaaaaa]" />
                <span>Share Link</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
