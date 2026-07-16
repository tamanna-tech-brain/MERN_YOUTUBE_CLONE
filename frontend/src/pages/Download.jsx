import { useEffect, useState } from "react";
import { getDownloads } from "../api/api";
import noImage from "../assets/no-image.jpg";
import { Link, useNavigate } from "react-router-dom";

const Downloads = () => {
  const [downloads, setDownloads] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 4; // Fetch 4 downloads per page
  const navigate = useNavigate();

  const fetchDownloads = async () => {
    try {
      setLoading(true);
      const res = await getDownloads({
        page,
        limit,
        search
      });

      setDownloads(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloads();
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
          ⬇️ Offline Downloads
        </h2>
        <p className="text-neutral-400 text-sm mt-1">Access your downloaded movies for offline viewing</p>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="🔍 Search downloads by movie title..."
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
            {downloads.map((d) => (
              <div
                key={d._id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:scale-[1.03] transition-all duration-300 shadow-xl group flex flex-col justify-between"
              >
                {/* PHOTO PREVIEW */}
                <div className="h-60 overflow-hidden relative">
                  <img
                    src={getPosterUrl(d.movieId?.poster)}
                    onError={(e) => (e.target.src = noImage)}
                    alt={d.movieId?.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-85"></div>
                  
                  {/* Hover play button */}
                  <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300">
                    <button
                      onClick={() => navigate(`/movie/${d.movieId?._id}`)}
                      className="bg-red-600 hover:bg-red-700 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg cursor-pointer transform scale-75 group-hover:scale-100 transition duration-300"
                    >
                      ▶
                    </button>
                  </div>
                </div>

                {/* INFO */}
                <div className="p-5 flex flex-col justify-between">
                  <h3 className="font-bold text-base leading-tight truncate capitalize">
                    {d.movieId?.title || "No Title"}
                  </h3>
                  {d.downloadedAt && (
                    <p className="text-neutral-500 text-[10px] mt-1.5 font-medium">
                      Downloaded: {new Date(d.downloadedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* EMPTY */}
          {downloads.length === 0 && (
            <div className="text-center py-20 bg-neutral-900/50 border border-neutral-850 rounded-2xl">
              <span className="text-4xl">⬇️</span>
              <p className="text-neutral-400 mt-3 text-sm">No offline downloads found.</p>
            </div>
          )}

          {/* PAGINATION */}
          {downloads.length > 0 && (
            <div className="flex justify-center items-center gap-6 mt-12 bg-neutral-900 border border-neutral-850 max-w-xs mx-auto p-2 rounded-2xl">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="w-10 h-10 flex items-center justify-center bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 disabled:opacity-40 disabled:hover:bg-neutral-950 rounded-xl transition cursor-pointer"
              >
                ◀
              </button>

              <span className="text-sm font-semibold tracking-wide text-neutral-300">
                Page {page} / {totalPages}
              </span>

              <button
                disabled={page === totalPages}
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

export default Downloads;