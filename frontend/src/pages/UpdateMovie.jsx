import { useEffect, useState, useRef } from "react";
import { getMovieById, updateMovie, getCategories, getCasts, uploadFile, getServerUrl } from "../api/api";
import { useParams, useNavigate } from "react-router-dom";

const UpdateMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const titleRef = useRef();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [duration, setDuration] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [poster, setPoster] = useState("");
  const [video, setVideo] = useState("");

  const [categoryIds, setCategoryIds] = useState([]);
  const [castIds, setCastIds] = useState([]);

  const [categories, setCategories] = useState([]);
  const [casts, setCasts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }

    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch categories & casts
        let allCategories = [];
        let allCasts = [];

        let catPage = 1;
        let catTotalPages = 1;
        while (catPage <= catTotalPages) {
          const res = await getCategories({ page: catPage, limit: 50 });
          allCategories = [...allCategories, ...(res.data.data || [])];
          catTotalPages = res.data.pagination?.totalPages || 1;
          catPage++;
        }

        let castPage = 1;
        let castTotalPages = 1;
        while (castPage <= castTotalPages) {
          const res = await getCasts({ page: castPage, limit: 50 });
          allCasts = [...allCasts, ...(res.data.data || [])];
          castTotalPages = res.data.pagination?.totalPages || 1;
          castPage++;
        }

        setCategories(allCategories);
        setCasts(allCasts);

        // Fetch Movie Details
        const resMovie = await getMovieById(id);
        const m = resMovie.data.data;
        if (m) {
          setTitle(m.title);
          setDescription(m.description);
          setLanguage(m.language || "");
          setDuration(m.duration || "");
          setReleaseYear(m.releaseYear || "");
          setPoster(m.poster || "");
          setVideo(m.video || "");
          setCategoryIds(m.categoryId || []);
          setCastIds(m.cast || []);
        }
      } catch (err) {
        console.error("Fetch movie error:", err);
        setError("Failed to load movie details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

  const handleCategoryChange = (e) => {
    const values = Array.from(e.target.selectedOptions, (o) => o.value);
    setCategoryIds(values);
  };

  const handleCastChange = (e) => {
    const values = Array.from(e.target.selectedOptions, (o) => o.value);
    setCastIds(values);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setError("");
      const res = await uploadFile(formData);
      setPoster(res.data.url);
    } catch (err) {
      setError(err.message || "Failed to upload poster file");
    } finally {
      setUploading(false);
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setVideoUploading(true);
      setError("");
      const res = await uploadFile(formData);
      setVideo(res.data.url);
    } catch (err) {
      setError(err.message || "Failed to upload video");
    } finally {
      setVideoUploading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !description || !language || !duration || !releaseYear || categoryIds.length === 0 || castIds.length === 0) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setSubmitting(true);
      await updateMovie(id, {
        title,
        description,
        language,
        duration: Number(duration),
        releaseYear: Number(releaseYear),
        categoryId: categoryIds[0], // Pass singular string since Joi schema expects string categoryId
        cast: castIds,
        poster,
        video
      });

      alert("🎉 Movie updated successfully");
      navigate("/movies");
    } catch (err) {
      setError(err.message || "Update failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <h2 className="text-xl font-bold animate-pulse text-red-500">Loading movie details...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex justify-center items-center py-12 px-4">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center mb-6 tracking-tight">
          🎬 Edit Movie
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Movie Title
            </label>
            <input
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 h-24 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                Language
              </label>
              <input
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                Duration (mins)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                Release Year
              </label>
              <input
                type="number"
                value={releaseYear}
                onChange={(e) => setReleaseYear(e.target.value)}
                className="w-full p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Movie Poster Image
            </label>
            <div className="flex flex-col sm:flex-row gap-4 items-center bg-neutral-950 p-4 rounded-xl border border-neutral-800">
              <div className="w-24 h-32 bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden flex items-center justify-center relative flex-shrink-0">
                {poster ? (
                  <img
                    src={poster.startsWith("/uploads") ? `${getServerUrl()}${poster}` : poster}
                    alt="Poster Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-neutral-600 text-xs text-center px-2">No Poster</span>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-xs text-red-500 font-bold animate-pulse">Uploading...</span>
                  </div>
                )}
              </div>
              <div className="w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="poster-upload-edit"
                  disabled={uploading}
                />
                <label
                  htmlFor="poster-upload-edit"
                  className="inline-block bg-neutral-800 hover:bg-neutral-700 text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer transition border border-neutral-700"
                >
                  Change Image File
                </label>
                <p className="text-xs text-neutral-500 mt-2">
                  JPG, PNG, WEBP or GIF. Max size 5MB.
                </p>
                {poster && (
                  <p className="text-[10px] text-green-500 truncate mt-1">
                    Path: {poster}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* VIDEO UPLOADER */}
          <div className="border-t border-neutral-800 pt-5">
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
              Upload Video File
            </label>
            <div className="flex items-center gap-4 bg-neutral-950 p-4 rounded-xl border border-neutral-850">
              <div className="w-24 h-16 bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 relative">
                {video ? (
                  <video
                    src={`${getServerUrl()}${video}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-neutral-600 text-xs text-center px-2">No Video</span>
                )}
                {videoUploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-xs text-green-500 font-bold animate-pulse">Uploading...</span>
                  </div>
                )}
              </div>
              <div className="w-full">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                  id="video-upload-edit"
                  disabled={videoUploading}
                />
                <label
                  htmlFor="video-upload-edit"
                  className="inline-block bg-neutral-800 hover:bg-neutral-700 text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer transition border border-neutral-700"
                >
                  Change Video File
                </label>
                <p className="text-xs text-neutral-500 mt-2">
                  MP4, WEBM or OGG. Max size 50MB.
                </p>
                {video && (
                  <p className="text-[10px] text-green-500 truncate mt-1">
                    Path: {video}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                Categories (Cmd/Ctrl click to multi-select)
              </label>
              <select
                multiple
                value={categoryIds}
                onChange={handleCategoryChange}
                className="w-full h-32 p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-red-500 outline-none"
                required
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id} className="p-1 rounded hover:bg-red-600/30">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                Cast (Cmd/Ctrl click to multi-select)
              </label>
              <select
                multiple
                value={castIds}
                onChange={handleCastChange}
                className="w-full h-32 p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-red-500 outline-none"
                required
              >
                {casts.map((c) => (
                  <option key={c._id} value={c._id} className="p-1 rounded hover:bg-red-600/30">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/movies")}
              className="w-1/3 bg-neutral-800 hover:bg-neutral-700 py-3 rounded-lg font-bold transition text-center cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="w-2/3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 py-3 rounded-lg font-bold transition flex justify-center items-center gap-2 text-white shadow-lg shadow-red-600/10 cursor-pointer"
            >
              {submitting ? "Updating..." : "Update Movie"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMovie;