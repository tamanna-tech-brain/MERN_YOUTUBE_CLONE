import { useEffect, useState, useCallback, useContext } from "react";
import { getHistory, getServerUrl } from "../api/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { History as HistoryIcon, Trash2, Pause, Search, CheckCircle2 } from "lucide-react";
import noImage from "../assets/no-image.jpg";

const History = () => {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const { sidebarOpen } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getHistory({ limit: 50, search }).catch(() => null);
      if (res?.data?.data && res.data.data.length > 0) {
        setHistory(res.data.data);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error(err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleClearHistory = () => {
    if (window.confirm("Clear all watch history?")) {
      setHistory([]);
    }
  };

  const handleRemoveItem = (id) => {
    setHistory((prev) => prev.filter((item) => item._id !== id));
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
      <div className="p-4 sm:p-6 max-w-[1500px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-6">
            <div className="border-b border-[#272727] pb-4">
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
                <HistoryIcon className="w-6 h-6 text-[#ff0000]" />
                <span>Watch History</span>
              </h1>
              <p className="text-xs text-[#aaaaaa] mt-1">
                Movies and videos you have watched across all devices
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-4 border-[#ff0000] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-20 bg-[#181818] rounded-2xl border border-[#272727] p-8">
                <span className="text-4xl mb-3 block">🎞️</span>
                <h3 className="text-base font-bold text-white">Your Watch History is Empty</h3>
                <p className="text-xs text-[#aaaaaa] mt-1 mb-4">Videos that you watch will show up here.</p>
                <button
                  onClick={() => navigate("/")}
                  className="px-5 py-2 bg-[#ff0000] text-white rounded-full text-xs font-semibold"
                >
                  Explore Videos
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item) => {
                  const m = item.movieId || item;
                  return (
                    <div
                      key={item._id}
                      className="flex flex-col sm:flex-row gap-4 group p-2 rounded-xl hover:bg-[#1f1f1f] transition relative"
                    >
                      
                      <div
                        onClick={() => navigate(`/movie/${m._id}`)}
                        className="relative w-full sm:w-60 aspect-video rounded-xl overflow-hidden bg-[#272727] flex-shrink-0 cursor-pointer"
                      >
                        <img
                          src={getPosterUrl(m.poster)}
                          alt={m.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                        <span className="absolute bottom-1.5 right-1.5 bg-black/85 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                          {m.durationFormatted || "18:24"}
                        </span>
                      </div>

                      
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex items-start justify-between">
                            <h3
                              onClick={() => navigate(`/movie/${m._id}`)}
                              className="text-sm sm:text-base font-semibold text-white group-hover:text-[#3ea6ff] transition cursor-pointer line-clamp-2 leading-tight"
                            >
                              {m.title}
                            </h3>

                            <button
                              onClick={() => handleRemoveItem(item._id)}
                              className="text-[#aaaaaa] hover:text-white p-1 rounded-full hover:bg-[#333333] transition"
                              title="Remove from watch history"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-xs text-[#aaaaaa] mt-1.5 flex items-center gap-1.5">
                            <span>{m.channelName || "Official Channel"}</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#aaaaaa]" />
                            <span>•</span>
                            <span>{m.views || "1.4M views"}</span>
                          </div>

                          <p className="text-xs text-[#717171] line-clamp-2 mt-2 leading-relaxed">
                            {m.description || "Video playback record recorded in YouTube clone session."}
                          </p>
                        </div>

                        {item.watchedAt && (
                          <span className="text-[11px] text-[#888888] mt-2 block">
                            Watched on: {new Date(item.watchedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#181818] border border-[#272727] rounded-2xl p-5 space-y-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717171]" />
                <input
                  type="text"
                  placeholder="Search watch history..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#121212] border border-[#303030] focus:border-[#3ea6ff] rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-[#717171] outline-none"
                />
              </div>

              <div className="space-y-1 pt-2 border-t border-[#272727] text-xs font-semibold">
                <button
                  onClick={handleClearHistory}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:bg-[#272727] transition text-left cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-[#aaaaaa]" />
                  <span>Clear all watch history</span>
                </button>
                <button
                  onClick={() => alert("Watch history is paused.")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:bg-[#272727] transition text-left cursor-pointer"
                >
                  <Pause className="w-4 h-4 text-[#aaaaaa]" />
                  <span>Pause watch history</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;