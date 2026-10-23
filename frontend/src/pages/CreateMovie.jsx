import { useState, useEffect, useRef, useContext } from "react";
import { createMovie, getCategories, getCasts, uploadFile, getServerUrl } from "../api/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Video, Upload, Image, CheckCircle2, Play, Sparkles, AlertCircle } from "lucide-react";

const CreateMovie = () => {
  const navigate = useNavigate();
  const titleRef = useRef();
  const { sidebarOpen, userId, username } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("English");
  const [duration, setDuration] = useState("15");
  const [releaseYear, setReleaseYear] = useState(new Date().getFullYear().toString());
  const [poster, setPoster] = useState("");
  const [video, setVideo] = useState("");

  const [categoryIds, setCategoryIds] = useState([]);
  const [castIds, setCastIds] = useState([]);

  const [categories, setCategories] = useState([]);
  const [casts, setCasts] = useState([]);

  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [uploadingVideo, setVideoUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (titleRef.current) titleRef.current.focus();

    const fetchDropdowns = async () => {
      try {
        const [catRes, castRes] = await Promise.all([
          getCategories({ limit: 50 }).catch(() => null),
          getCasts({ limit: 50 }).catch(() => null),
        ]);

        if (catRes?.data?.data && catRes.data.data.length > 0) {
          setCategories(catRes.data.data);
          setCategoryIds([catRes.data.data[0]._id]);
        }

        if (castRes?.data?.data && castRes.data.data.length > 0) {
          setCasts(castRes.data.data);
          setCastIds([castRes.data.data[0]._id]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchDropdowns();
  }, []);

  const handlePosterUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadingPoster(true);
      setError("");
      const res = await uploadFile(formData);
      setPoster(res.data.url);
    } catch {
      setError("Poster file upload failed, but you can paste an image URL instead.");
    } finally {
      setUploadingPoster(false);
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
    } catch {
      setError("Video file upload failed, but you can paste a video URL instead.");
    } finally {
      setVideoUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const activeUserId = userId || localStorage.getItem("userId");
    if (!activeUserId) {
      setError("Please sign in to publish a video.");
      return;
    }

    if (!title.trim() || !description.trim()) {
      setError("Please provide a video title and description.");
      return;
    }

    const targetCategoryId = categoryIds[0] || categories[0]?._id;
    if (!targetCategoryId) {
      setError("Please select or create at least one category/topic before publishing.");
      return;
    }

    try {
      setSubmitting(true);
      await createMovie({
        userId: activeUserId,
        title: title.trim(),
        description: description.trim(),
        director: username || "Verified Creator",
        language: language || "English",
        duration: Number(duration) * 60 || 720,
        releaseYear: Number(releaseYear) || 2026,
        categoryId: targetCategoryId,
        cast: castIds.length > 0 ? castIds : (casts[0]?._id ? [casts[0]._id] : []),
        poster: poster.trim(),
        video: video.trim(),
      });

      alert("🎉 Video published successfully to YouTube!");
      navigate("/movies");
    } catch (err) {
      setError(err.message || "Failed to publish video.");
    } finally {
      setSubmitting(false);
    }
  };

  const getPreviewPoster = () => {
    if (!poster) return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80";
    if (poster.startsWith("/uploads")) return `${getServerUrl()}${poster}`;
    return poster;
  };

  return (
    <div
      className={`min-h-screen bg-[#0f0f0f] text-[#f1f1f1] pt-16 pb-16 transition-all duration-200 ${
        sidebarOpen ? "md:ml-60" : "md:ml-[72px]"
      }`}
    >
      <div className="p-4 sm:p-6 max-w-[1500px] mx-auto space-y-6">
        
        <div className="flex justify-between items-center border-b border-[#272727] pb-5">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
              <Video className="w-6 h-6 text-[#ff0000]" />
              <span>YouTube Studio • Video Upload</span>
            </h1>
            <p className="text-xs text-[#aaaaaa] mt-1">
              Add details, upload thumbnail and video source to publish to your channel
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-600/15 border border-red-500/30 text-[#ff4e45] rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-5">
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-white uppercase tracking-wider">
                  Video Title (Required)
                </label>
                <span className="text-[11px] text-[#aaaaaa]">{title.length}/100</span>
              </div>
              <input
                ref={titleRef}
                type="text"
                placeholder="Add a title that catches viewers' attention"
                value={title}
                maxLength={100}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-[#181818] border border-[#303030] focus:border-[#3ea6ff] rounded-xl p-3 text-sm text-white placeholder-[#717171] outline-none transition"
              />
            </div>

            
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Description (Required)
              </label>
              <textarea
                rows={4}
                placeholder="Tell viewers what your video is about, add timestamps or links..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full bg-[#181818] border border-[#303030] focus:border-[#3ea6ff] rounded-xl p-3 text-sm text-white placeholder-[#717171] outline-none transition"
              />
            </div>

            
            <div className="bg-[#181818] border border-[#272727] p-4 rounded-xl space-y-3">
              <label className="block text-xs font-bold text-white uppercase tracking-wider">
                Thumbnail Image
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Paste thumbnail image URL (Unsplash or direct image URL)"
                  value={poster}
                  onChange={(e) => setPoster(e.target.value)}
                  className="flex-1 bg-[#121212] border border-[#303030] focus:border-[#3ea6ff] rounded-lg px-3 py-2 text-xs text-white placeholder-[#717171] outline-none"
                />
                <label className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#272727] hover:bg-[#383838] rounded-lg text-xs font-semibold text-white cursor-pointer transition whitespace-nowrap">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingPoster ? "Uploading..." : "Upload File"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePosterUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            
            <div className="bg-[#181818] border border-[#272727] p-4 rounded-xl space-y-3">
              <label className="block text-xs font-bold text-white uppercase tracking-wider">
                Video Source
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Paste MP4 stream URL or leave empty for default demo video"
                  value={video}
                  onChange={(e) => setVideo(e.target.value)}
                  className="flex-1 bg-[#121212] border border-[#303030] focus:border-[#3ea6ff] rounded-lg px-3 py-2 text-xs text-white placeholder-[#717171] outline-none"
                />
                <label className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#272727] hover:bg-[#383838] rounded-lg text-xs font-semibold text-white cursor-pointer transition whitespace-nowrap">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingVideo ? "Uploading..." : "Upload Video File"}</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                  Category / Topic
                </label>
                <select
                  value={categoryIds[0] || ""}
                  onChange={(e) => setCategoryIds([e.target.value])}
                  className="w-full bg-[#181818] border border-[#303030] text-white rounded-xl p-3 text-xs outline-none cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                  Creator / Cast Member
                </label>
                <select
                  value={castIds[0] || ""}
                  onChange={(e) => setCastIds([e.target.value])}
                  className="w-full bg-[#181818] border border-[#303030] text-white rounded-xl p-3 text-xs outline-none cursor-pointer"
                >
                  {casts.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                  Duration (mins)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-[#181818] border border-[#303030] rounded-xl p-3 text-xs text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                  Language
                </label>
                <input
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-[#181818] border border-[#303030] rounded-xl p-3 text-xs text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                  Year
                </label>
                <input
                  type="number"
                  value={releaseYear}
                  onChange={(e) => setReleaseYear(e.target.value)}
                  className="w-full bg-[#181818] border border-[#303030] rounded-xl p-3 text-xs text-white outline-none"
                />
              </div>
            </div>

            
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-6 bg-[#3ea6ff] hover:bg-[#2088df] disabled:bg-[#272727] text-black disabled:text-[#717171] font-bold rounded-xl text-sm transition shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                {submitting ? "Publishing..." : "Publish to YouTube 🚀"}
              </button>
            </div>
          </form>

          
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-bold text-[#aaaaaa] uppercase tracking-wider">
              Live YouTube Feed Preview
            </h3>

            <div className="bg-[#181818] border border-[#272727] p-4 rounded-2xl space-y-3">
              
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-md">
                <img
                  src={getPreviewPoster()}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                  {duration ? `${duration}:00` : "15:00"}
                </span>
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center">
                    <Play className="w-4 h-4 ml-0.5 fill-white" />
                  </div>
                </div>
              </div>

              
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-red-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                  {username ? username.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white line-clamp-2 leading-tight">
                    {title || "Untitled Video (Type in the form to preview)"}
                  </h4>
                  <p className="text-xs text-[#aaaaaa] mt-1 flex items-center gap-1">
                    <span>{username || "Your Channel"}</span>
                    <CheckCircle2 className="w-3 h-3 text-[#aaaaaa]" />
                  </p>
                  <p className="text-xs text-[#aaaaaa] mt-0.5">
                    0 views • Just now
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#181818] border border-[#272727] p-4 rounded-xl text-xs text-[#aaaaaa] space-y-2">
              <p className="font-semibold text-white">💡 Tips for great videos:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Choose a high-resolution 16:9 thumbnail</li>
                <li>Make your title punchy and informative</li>
                <li>Include keywords in your description for discoverability</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMovie;