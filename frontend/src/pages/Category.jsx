import { useEffect, useState } from "react";
import { getCategories, deleteCategory, getServerUrl } from "../api/api";
import { Link, useNavigate } from "react-router-dom";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const limit = 2; // Display 2 categories per page
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategories({
        page,
        limit,
        search
      });

      setCategories(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      console.log(err);
      alert("Error fetching categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category? All associated movies might lose their category reference.")) return;
    try {
      await deleteCategory(id);
      alert("Category deleted successfully");
      fetchCategories();
    } catch {
      alert("Delete failed");
    }
  };

  const getCategoryUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("/uploads")) {
      return `${getServerUrl()}${imagePath}`;
    }
    return imagePath;
  };

  // Map category names to aesthetic movie-related icons
  const getCategoryIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes("action") || n.includes("thriller")) return "💥";
    if (n.includes("comedy")) return "😂";
    if (n.includes("drama")) return "🎭";
    if (n.includes("sci-fi") || n.includes("fiction")) return "🚀";
    if (n.includes("horror")) return "👻";
    if (n.includes("romance")) return "💖";
    if (n.includes("documentary")) return "📽️";
    if (n.includes("anime") || n.includes("cartoon")) return "🌸";
    return "🎬";
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            Movie Categories
          </h2>
          <p className="text-neutral-400 text-sm mt-1">Organize movies by genre and theme</p>
        </div>

        <button
          onClick={() => navigate("/category/create")}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl transition duration-200 shadow-lg shadow-red-600/10 flex items-center gap-1.5 cursor-pointer"
        >
          <span>+ Add Category</span>
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-8">
        <input
          placeholder="🔍 Search categories by name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full p-4 bg-neutral-900 border border-neutral-800 rounded-2xl outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white placeholder-neutral-500 transition"
        />
      </div>

      {/* LIST */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {categories.map((c) => (
              <div
                key={c._id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:scale-[1.03] transition-all duration-300 shadow-xl p-6 flex flex-col justify-between"
              >
                {/* IMAGE/ICON BOX */}
                <div className="h-32 bg-neutral-950 border border-neutral-850 rounded-xl flex items-center justify-center text-5xl mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-red-600/5 blur-xl pointer-events-none"></div>
                  {c.image ? (
                    <img
                      src={getCategoryUrl(c.image)}
                      alt={c.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{getCategoryIcon(c.name)}</span>
                  )}
                </div>

                {/* INFO */}
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold truncate capitalize hover:text-red-500 cursor-pointer" onClick={() => navigate(`/movies?category=${c._id}`)}>
                      {c.name}
                    </h3>
                    <p className="text-neutral-400 text-xs mt-1.5 line-clamp-3">
                      {c.description || "No description provided for this category."}
                    </p>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex justify-between items-center mt-6 text-xs font-semibold pt-4 border-t border-neutral-850">
                    <Link
                      to={`/category/${c._id}`}
                      className="text-red-400 hover:text-red-300 hover:underline transition"
                    >
                      View Details
                    </Link>

                    <Link
                      to={`/category/update/${c._id}`}
                      className="text-neutral-400 hover:text-white hover:underline transition"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(c._id)}
                      className="text-red-600 hover:text-red-500 hover:underline transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* EMPTY */}
          {categories.length === 0 && (
            <div className="text-center py-20 bg-neutral-900/50 border border-neutral-850 rounded-2xl">
              <span className="text-4xl">📂</span>
              <p className="text-neutral-400 mt-3 text-sm">No categories found.</p>
            </div>
          )}

          {/* PAGINATION */}
          {categories.length > 0 && (
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

export default Category;