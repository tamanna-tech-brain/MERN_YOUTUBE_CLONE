import { useEffect, useState, useRef } from "react";
import { getCastById, updateCast, uploadFile, getServerUrl } from "../api/api";
import { useParams, useNavigate } from "react-router-dom";

const UpdateCast = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const nameRef = useRef();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus();
    }

    const fetchCast = async () => {
      try {
        setLoading(true);
        const res = await getCastById(id);
        const data = res.data.data;
        if (data) {
          setName(data.name);
          setAge(data.age || "");
          setBio(data.bio || "");
          setImage(data.image || "");
        }
      } catch (err) {
        console.error("Fetch cast error:", err);
        setError("Failed to fetch cast member details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCast();
  }, [id]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setError("");
      const res = await uploadFile(formData);
      setImage(res.data.url);
    } catch (err) {
      setError(err.message || "Failed to upload image file");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !age || !bio || !image) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setSubmitting(true);
      await updateCast(id, { name, age: Number(age), bio, image });
      alert("🎉 Cast member updated successfully");
      navigate("/cast");
    } catch (err) {
      setError(err.message || "Update failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <h2 className="text-xl font-bold animate-pulse text-red-500">Loading cast details...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex justify-center items-center py-12 px-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center mb-6 tracking-tight">
          🎭 Edit Cast Member
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              ref={nameRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Age
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 h-24 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Profile Photo
            </label>
            <div className="flex gap-4 items-center bg-neutral-950 p-4 rounded-xl border border-neutral-800">
              <div className="w-20 h-20 bg-neutral-900 border border-neutral-800 rounded-full overflow-hidden flex items-center justify-center relative flex-shrink-0">
                {image ? (
                  <img
                    src={image.startsWith("/uploads") ? `${getServerUrl()}${image}` : image}
                    alt="Cast Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-neutral-600 text-[10px] text-center px-1">No Image</span>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-[10px] text-red-500 font-bold animate-pulse">Uploading...</span>
                  </div>
                )}
              </div>
              <div className="w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="cast-upload-edit"
                  disabled={uploading}
                />
                <label
                  htmlFor="cast-upload-edit"
                  className="inline-block bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition border border-neutral-700"
                >
                  Change Picture
                </label>
                <p className="text-[10px] text-neutral-500 mt-2">
                  JPG, PNG, WEBP. Max size 5MB.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/cast")}
              className="w-1/3 bg-neutral-800 hover:bg-neutral-700 py-3 rounded-lg font-bold transition text-center cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="w-2/3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 py-3 rounded-lg font-bold transition flex justify-center items-center gap-2 text-white shadow-lg shadow-red-600/10 cursor-pointer"
            >
              {submitting ? "Updating..." : "Update Cast Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCast;