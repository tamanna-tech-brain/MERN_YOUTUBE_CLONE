import { useState, useRef, useEffect } from "react";
import { createCast, uploadFile, getServerUrl } from "../api/api";
import { useNavigate } from "react-router-dom";

const CreateCast = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const nameRef = useRef();

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }, []);

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
      setError(err.message || "Failed to upload cast avatar file");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !age || !bio || !image) {
      setError("Please fill in all fields (including uploading an image)");
      return;
    }

    try {
      setSubmitting(true);
      await createCast({
        name,
        age: Number(age),
        bio,
        image
      });

      alert("🎉 Cast Created Successfully");
      navigate("/cast");
    } catch (err) {
      setError(err.message || "Failed to create cast.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex justify-center items-center py-12 px-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center mb-6 tracking-tight">
          🎭 Add Cast Member
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              ref={nameRef}
              placeholder="e.g. Leonardo DiCaprio"
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
              placeholder="e.g. 48"
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
              placeholder="Brief biography..."
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
                  id="cast-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="cast-upload"
                  className="inline-block bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition border border-neutral-700"
                >
                  Upload Picture
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
              {submitting ? "Adding..." : "Add Cast Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCast;