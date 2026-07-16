import { useState, useRef, useEffect } from "react";
import { createCategory } from "../api/api";
import { useNavigate } from "react-router-dom";

const CreateCategory = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const nameRef = useRef();

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !description) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setSubmitting(true);
      await createCategory({ name, description });
      alert("🎉 Category created successfully!");
      navigate("/category");
    } catch (err) {
      setError(err.message || "Failed to create category");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex justify-center items-center py-12 px-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center mb-6 tracking-tight">
          📂 Add Category
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Category Name
            </label>
            <input
              ref={nameRef}
              placeholder="e.g. Science Fiction"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              placeholder="Describe what kind of movies fall under this category..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 h-28 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition resize-none"
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/category")}
              className="w-1/3 bg-neutral-800 hover:bg-neutral-700 py-3 rounded-lg font-bold transition text-center cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-2/3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 py-3 rounded-lg font-bold transition flex justify-center items-center gap-2 text-white shadow-lg cursor-pointer"
            >
              {submitting ? "Creating..." : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategory;