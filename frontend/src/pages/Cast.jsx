import { useEffect, useState } from "react";
import { getCasts, deleteCast } from "../api/api";
import { useNavigate } from "react-router-dom";

const Cast = () => {
  const [casts, setCasts] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const limit = 4; // Display 4 cast members per page for grid alignment
  const navigate = useNavigate();

  const fetchCasts = async () => {
    try {
      setLoading(true);
      const res = await getCasts({
        page,
        limit,
        search
      });

      setCasts(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCasts();
  }, [page, search]);
  
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this cast member?")) return;

    try {
      await deleteCast(id);
      alert("Cast member removed successfully");
      fetchCasts();
    } catch {
      alert("Delete failed");
    }
  };

  const getCastUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("/uploads")) {
      return `${import.meta.env.VITE_API_URL || "http://localhost:3000"}${imagePath}`;
    }
    return imagePath;
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            🎭 Cast & Stars
          </h2>
          <p className="text-neutral-400 text-sm mt-1">Manage and view actors starring in movie entries</p>
        </div>

        <button
          onClick={() => navigate("/cast/create")}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl transition duration-200 shadow-lg shadow-red-600/10 flex items-center gap-1.5 cursor-pointer"
        >
          <span>+ Add Cast</span>
        </button>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="🔍 Search cast by name..."
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
            {casts.map((cast) => (
              <div
                key={cast._id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:scale-[1.03] transition-all duration-300 shadow-xl group flex flex-col justify-between"
              >
                {/* PHOTO PREVIEW */}
                <div className="h-64 bg-neutral-950 flex items-center justify-center relative overflow-hidden">
                  {cast.image ? (
                    <img
                      src={getCastUrl(cast.image)}
                      alt={cast.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    // Beautiful Default SVG Avatar
                    <svg className="w-20 h-20 text-neutral-800" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0 1 12.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
                    </svg>
                  )}
                  {cast.age && (
                    <span className="absolute bottom-3 right-3 bg-neutral-950/80 backdrop-blur-md text-xs text-neutral-300 font-bold px-2 py-0.5 rounded-md">
                      {cast.age} yrs
                    </span>
                  )}
                </div>

                {/* INFO */}
                <div className="p-5">
                  <h4 className="font-bold text-lg leading-tight truncate capitalize">{cast.name}</h4>
                  <p className="text-neutral-400 text-xs mt-1.5 line-clamp-2">
                    {cast.bio || "No biography details available."}
                  </p>

                  {/* ACTION BUTTONS */}
                  <div className="grid grid-cols-2 gap-2 mt-5">
                    <button
                      onClick={() => navigate(`/cast/${cast._id}`)}
                      className="bg-red-600 hover:bg-red-700 text-xs font-bold py-2 rounded-xl transition cursor-pointer flex justify-center items-center"
                    >
                      View Profile
                    </button>

                    <button
                      onClick={() => navigate(`/cast/update/${cast._id}`)}
                      className="bg-neutral-800 hover:bg-neutral-700 text-xs font-bold py-2 rounded-xl transition cursor-pointer flex justify-center items-center"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(cast._id)}
                      className="col-span-2 bg-red-950/40 hover:bg-red-900/40 border border-red-500/20 hover:border-red-500/40 text-red-400 text-xs font-semibold py-2 rounded-xl transition cursor-pointer"
                    >
                      Delete Member
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* EMPTY */}
          {casts.length === 0 && (
            <div className="text-center py-20 bg-neutral-900/50 border border-neutral-850 rounded-2xl">
              <span className="text-4xl">🎭</span>
              <p className="text-neutral-400 mt-3 text-sm">No cast members found.</p>
            </div>
          )}

          {/* PAGINATION */}
          {casts.length > 0 && (
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

export default Cast;