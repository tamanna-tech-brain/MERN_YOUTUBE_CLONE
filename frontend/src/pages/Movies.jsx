import { useEffect, useState } from "react";
import { getMovies, watchMovie, downloadMovie, deleteMovie, getServerUrl } from "../api/api";
import { useLocation, useNavigate } from "react-router-dom";
import noImage from "../assets/no-image.jpg";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const limit = 2; // Fetch 2 movies per page for custom layout limit

  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const categoryId = params.get("category");

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await getMovies({
        page,
        limit,
        search: searchText,
        categoryId
      });

      setMovies(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error("FETCH MOVIES ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [page, searchText, categoryId]);

  const handleWatch = async (movieId) => {
    try {
      const res = await watchMovie(movieId);
      alert(res.data.message || "🎬 Added to Watch History successfully!");
    } catch (err) {
      alert(err.message || "Watch action failed");
    }
  };
    
  const handleDownload = async (movieId) => {
    try {
      const res = await downloadMovie(movieId);
      alert("Downloaded successfully ✅");
    } catch (err) {
      console.error("DOWNLOAD ERROR:", err);
      const msg = err.message || "";
      if (msg.includes("duplicate") || msg.includes("E11000") || msg.includes("already")) {
        alert("This movie is already in your Downloads! ⬇️");
      } else {
        alert(msg || "Download failed ❌");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie? This action is irreversible.")) return;

    try {
      await deleteMovie(id);
      alert("Movie deleted successfully");
      fetchMovies();
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

  const getPosterUrl = (posterPath) => {
    if (!posterPath) return noImage;
    if (posterPath.startsWith("/uploads")) {
      return `${getServerUrl()}${posterPath}`;
    }
    return posterPath;
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            Featured Movies
          </h2>
          <p className="text-neutral-400 text-sm mt-1">Explore our latest uploads and releases</p>
        </div>

        <button
          onClick={() => navigate("/movie/create")}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl transition duration-200 shadow-lg shadow-red-600/10 flex items-center gap-1.5 cursor-pointer"
        >
          <span>+ Add Movie</span>
        </button>
      </div>

      {/* SEARCH AND FILTER BANNER */}
      <div className="mb-8">
        <input
          placeholder="🔍 Search movies by title..."
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setPage(1);
          }}
          className="w-full p-4 bg-neutral-900 border border-neutral-800 rounded-2xl outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white placeholder-neutral-500 transition"
        />
        {categoryId && (
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-neutral-400">Active Category Filter:</span>
            <span className="text-xs bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full flex items-center gap-1.5">
              Filtered Catalog
              <button onClick={() => navigate("/movies")} className="font-bold hover:text-white ml-1">✕</button>
            </span>
          </div>
        )}
      </div>

      {/* MOVIES GRID */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {movies.map((m) => (
              <div
                key={m._id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:scale-[1.03] transition-all duration-300 shadow-xl group flex flex-col justify-between"
              >
                {/* POSTER WRAPPER */}
                <div
                  className="relative h-64 overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/movie/${m._id}`)}
                >
                  <img
                    src={getPosterUrl(m.poster)}
                    onError={(e) => (e.target.src = noImage)}
                    alt={m.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-85"></div>
                  
                  {/* Category badges */}
                  {m.category && (
                    <span className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md text-[10px] text-red-500 font-bold px-2 py-1 rounded-md border border-neutral-800">
                      {m.category.name}
                    </span>
                  )}
                  
                  {m.releaseYear && (
                    <span className="absolute bottom-3 right-3 bg-neutral-950/80 backdrop-blur-md text-xs text-neutral-300 font-medium px-2 py-0.5 rounded-md">
                      {m.releaseYear}
                    </span>
                  )}
                </div>

                {/* MOVIE INFO */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h3
                      onClick={() => navigate(`/movie/${m._id}`)}
                      className="font-bold text-lg leading-tight truncate hover:text-red-500 transition cursor-pointer capitalize"
                    >
                      {m.title}
                    </h3>
                    <p className="text-neutral-400 text-xs mt-1.5 line-clamp-2">
                      {m.description}
                    </p>
                  </div>

                  {/* QUICK BUTTON ACTIONS */}
                  <div className="grid grid-cols-2 gap-2.5 mt-5">
                    <button
                      onClick={() => handleWatch(m._id)}
                      className="bg-red-600 hover:bg-red-700 text-xs font-bold py-2 rounded-xl transition cursor-pointer flex justify-center items-center gap-1.5"
                    >
                      <span>Play 🎬</span>
                    </button>

                    <button
                      onClick={() => handleDownload(m._id)}
                      className="bg-neutral-800 hover:bg-neutral-700 text-xs font-bold py-2 rounded-xl transition cursor-pointer flex justify-center items-center gap-1.5"
                    >
                      <span>Save ⬇️</span>
                    </button>

                    <button
                      onClick={() => navigate(`/movie/update/${m._id}`)}
                      className="bg-neutral-850 hover:bg-neutral-700 border border-neutral-800 hover:border-neutral-600 text-neutral-300 hover:text-white text-xs font-semibold py-2 rounded-xl transition cursor-pointer"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(m._id)}
                      className="bg-red-950/40 hover:bg-red-900/40 border border-red-500/20 hover:border-red-500/40 text-red-400 text-xs font-semibold py-2 rounded-xl transition cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* EMPTY STATE */}
          {movies.length === 0 && (
            <div className="text-center py-20 bg-neutral-900/50 border border-neutral-850 rounded-2xl">
              <span className="text-4xl">🎬</span>
              <p className="text-neutral-400 mt-3 text-sm">No movies found in this list.</p>
              <button
                onClick={() => { setSearchText(""); navigate("/movies"); }}
                className="text-red-500 text-xs hover:underline mt-2 font-medium"
              >
                Clear all search filters
              </button>
            </div>
          )}

          {/* PAGINATION PANEL */}
          {movies.length > 0 && (
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

export default Movies;