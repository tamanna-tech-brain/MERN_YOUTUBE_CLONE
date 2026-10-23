import { useEffect, useState, useContext } from "react";
import { getDownloads, getServerUrl } from "../api/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Download as DownloadIcon, Play, Trash2, CheckCircle2, HardDrive } from "lucide-react";
import noImage from "../assets/no-image.jpg";

const Downloads = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(false);
  const { sidebarOpen } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchDownloads = async () => {
    try {
      setLoading(true);
      const res = await getDownloads({ limit: 50 }).catch(() => null);
      if (res?.data?.data && res.data.data.length > 0) {
        setDownloads(res.data.data);
      } else {
        setDownloads([]);
      }
    } catch (err) {
      console.error(err);
      setDownloads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloads();
  }, []);

  const handleRemove = (id) => {
    setDownloads((prev) => prev.filter((d) => d._id !== id));
  };

  const getPosterUrl = (posterPath) => {
    if (!posterPath) return noImage;
    if (posterPath.startsWith("/uploads")) {
      return `${getServerUrl()}${posterPath}`;
    }
    return posterPath;
  };

  return (
    <div
      className={`min-h-screen bg-[#0f0f0f] text-[#f1f1f1] pt-16 pb-16 transition-all duration-200 ${
        sidebarOpen ? "md:ml-60" : "md:ml-[72px]"
      }`}
    >
      <div className="p-4 sm:p-6 max-w-[1500px] mx-auto space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#272727] pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
              <DownloadIcon className="w-7 h-7 text-[#ff0000]" />
              <span>Downloads & Offline Library</span>
            </h1>
            <p className="text-xs text-[#aaaaaa] mt-1">
              Watch your favorite downloaded videos anywhere, anytime
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#aaaaaa] bg-[#181818] border border-[#272727] px-3.5 py-1.5 rounded-full">
            <HardDrive className="w-3.5 h-3.5 text-[#3ea6ff]" />
            <span>Storage: 1.2 GB of 128 GB used</span>
          </div>
        </div>

        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#ff0000] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : downloads.length === 0 ? (
          <div className="text-center py-20 bg-[#181818] rounded-2xl border border-[#272727] p-8">
            <span className="text-4xl mb-3 block">⬇️</span>
            <h3 className="text-base font-bold text-white">No downloaded videos yet</h3>
            <p className="text-xs text-[#aaaaaa] mt-1 mb-4">
              Click the download button on any video to watch it offline.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2 bg-[#ff0000] text-white rounded-full text-xs font-semibold"
            >
              Browse Videos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {downloads.map((item) => {
              const m = item.movieId || item;
              return (
                <div
                  key={item._id}
                  className="bg-[#181818] border border-[#272727] hover:border-[#383838] rounded-2xl overflow-hidden group flex flex-col justify-between transition hover:shadow-xl"
                >
                  
                  <div
                    onClick={() => navigate(`/movie/${m._id}`)}
                    className="relative aspect-video bg-[#272727] cursor-pointer overflow-hidden"
                  >
                    <img
                      src={getPosterUrl(m.poster)}
                      alt={m.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                      {m.durationFormatted || "18:24"}
                    </span>
                    <span className="absolute top-2 left-2 bg-blue-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider backdrop-blur-sm">
                      1080p HD
                    </span>

                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 ml-0.5 fill-white" />
                      </div>
                    </div>
                  </div>

                  
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        onClick={() => navigate(`/movie/${m._id}`)}
                        className="font-semibold text-sm text-white line-clamp-2 leading-tight group-hover:text-[#3ea6ff] cursor-pointer transition"
                      >
                        {m.title}
                      </h3>
                      <p className="text-xs text-[#aaaaaa] mt-1 flex items-center gap-1">
                        <span>{m.channelName || "Official Channel"}</span>
                        <CheckCircle2 className="w-3 h-3 text-[#aaaaaa]" />
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#272727] flex items-center justify-between">
                      <span className="text-[11px] text-green-400 font-semibold flex items-center gap-1">
                        ● Available Offline
                      </span>
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="p-1.5 text-[#aaaaaa] hover:text-[#ff4e45] rounded-full hover:bg-[#272727] transition"
                        title="Remove from downloads"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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

export default Downloads;