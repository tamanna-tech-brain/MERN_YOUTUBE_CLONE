import { useEffect, useState } from "react";
import { getCategoryById, getServerUrl } from "../api/api";
import { useParams, useNavigate } from "react-router-dom";

const CategoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const res = await getCategoryById(id);
        setCategory(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load category details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  const getCategoryIcon = (name) => {
    if (!name) return "🎬";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex justify-center items-center text-white">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-center items-center p-6">
        <span className="text-4xl mb-4">⚠️</span>
        <p className="text-red-500 font-semibold">{error || "Category not found"}</p>
        <button
          onClick={() => navigate("/category")}
          className="mt-6 bg-neutral-800 hover:bg-neutral-700 px-6 py-2 rounded-xl transition font-bold"
        >
          Return to Categories
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white py-12 px-6 flex justify-center items-center">
      <div className="w-full max-w-xl bg-neutral-900 border border-neutral-850 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col items-center text-center space-y-6">
          {/* IMAGE / ICON BOX */}
          <div className="w-32 h-32 bg-neutral-950 border border-neutral-850 rounded-2xl flex items-center justify-center text-6xl shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 bg-red-600/5 blur-lg"></div>
            {category.image ? (
              <img
                src={category.image.startsWith("/uploads") ? `${getServerUrl()}${category.image}` : category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="relative z-10">{getCategoryIcon(category.name)}</span>
            )}
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold capitalize text-white tracking-tight">
              {category.name}
            </h2>
            <span className="inline-block bg-neutral-950 text-red-500 border border-neutral-850 text-xs font-semibold px-4 py-1.5 rounded-full">
              Category Directory
            </span>
          </div>

          <div className="w-full max-w-md">
            <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">Description</h4>
            <p className="text-neutral-300 leading-relaxed text-sm bg-neutral-950/60 p-4 rounded-xl border border-neutral-850/60">
              {category.description || "No biography or description provided for this category."}
            </p>
          </div>

          <div className="flex gap-4 w-full justify-center pt-6">
            <button
              onClick={() => navigate("/category")}
              className="bg-neutral-850 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-bold px-6 py-3 rounded-xl transition cursor-pointer"
            >
              Back to List
            </button>
            <button
              onClick={() => navigate(`/movies?category=${category._id}`)}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-6 py-3 rounded-xl transition cursor-pointer shadow-lg shadow-red-600/10"
            >
              Browse Movies ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetails;