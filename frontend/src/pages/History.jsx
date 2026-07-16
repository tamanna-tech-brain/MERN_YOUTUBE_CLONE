import { useEffect, useState } from "react";
import { getHistory } from "../api/api";
import { Link } from "react-router-dom";
import noImage from "../assets/no-image.jpg";

const History = () => {
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(4); // Display 4 entries for catalog grid alignment
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await getHistory({ page, limit, search });
      setHistory(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch (err) {
      console.error("HISTORY ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, search]);

  const getPosterUrl = (posterPath) => {
    if (!posterPath) return noImage;
    if (posterPath.startsWith("/uploads")) {
      return `${import.meta.env.VITE_API_URL || "http://localhost:3000"}${posterPath}`;
    }
    return posterPath;
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
          🎥 Watch History
        </h2>
        <p className="text-neutral-400 text-sm mt-1">Review the movies and shows you've watched</p>
      </div>

      {/* SEARCH */}
      <input
        placeholder="🔍 Search watch history..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="w-full mb-8 p-4 bg-neutral-900 border border-neutral-800 rounded-2xl outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white placeholder-neutral-500 transition"
      />

      {/* GRID */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {history.map((h) => (
              <div
                key={h._id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:scale-[1.03] transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                {/* PHOTO / POSTER */}
                <div className="h-60 overflow-hidden relative">
                  <img
                    src={getPosterUrl(h.movieId?.poster)}
                    onError={(e) => (e.target.src = noImage)}
                    alt={h.movieId?.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-85"></div>
                  {h.watchedAt && (
                    <span className="absolute bottom-3 left-3 bg-neutral-950/80 backdrop-blur-md text-[10px] text-neutral-400 px-2.5 py-1 rounded-md border border-neutral-805">
                      Watched: {new Date(h.watchedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {/* INFO */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <h4 className="font-bold text-base leading-tight truncate capitalize">
                    {h.movieId?.title || "Unknown Movie"}
                  </h4>

                  <Link
                    to={h.movieId?._id ? `/movie/${h.movieId._id}` : "#"}
                    className="block mt-4 text-center bg-red-600 hover:bg-red-700 text-xs font-bold py-2.5 rounded-xl transition cursor-pointer"
                  >
                    View Details 🎬
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* EMPTY */}
          {history.length === 0 && (
            <div className="text-center py-20 bg-neutral-900/50 border border-neutral-850 rounded-2xl">
              <span className="text-4xl">🎥</span>
              <p className="text-neutral-400 mt-3 text-sm">No watch history records found.</p>
            </div>
          )}

          {/* PAGINATION */}
          {history.length > 0 && (
            <div className="flex justify-center items-center gap-6 mt-12 bg-neutral-900 border border-neutral-850 max-w-xs mx-auto p-2 rounded-2xl">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="w-10 h-10 flex items-center justify-center bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 disabled:opacity-40 disabled:hover:bg-neutral-950 rounded-xl transition cursor-pointer"
              >
                ◀
              </button>

              <span className="text-sm font-semibold tracking-wide text-neutral-300">
                Page {pagination.page || page} / {pagination.totalPages || 1}
              </span>

              <button
                disabled={page === (pagination.totalPages || 1)}
                onClick={() => setPage(page + 1)}
                className="w-10 h-10 flex items-center justify-center bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 disabled:opacity-40 disabled:hover:bg-neutral-950 rounded-xl transition cursor-pointer"
              >
                ▶
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default History;