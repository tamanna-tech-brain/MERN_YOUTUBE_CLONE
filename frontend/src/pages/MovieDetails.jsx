import { useEffect, useState } from "react";
import { getMovieById, watchMovie, downloadMovie, getServerUrl } from "../api/api";
import { useParams, useNavigate, Link } from "react-router-dom";
import noImage from "../assets/no-image.jpg";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const res = await getMovieById(id);
        setMovie(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Could not load movie details.");
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  const handleWatch = async () => {
    if (!movie) return;
    try {
      await watchMovie(movie._id);
      alert("🎬 Movie added to your watch history!");
    } catch (err) {
      alert("Failed to play movie");
    }
  };

  const handleDownload = async () => {
    if (!movie) return;
    try {
      await downloadMovie(movie._id);
      alert("Movie download initiated successfully! ✅");
    } catch (err) {
      alert("Download failed or movie already downloaded.");
    }
  };

  const getPosterUrl = (posterPath) => {
    if (!posterPath) return noImage;
    if (posterPath.startsWith("/uploads")) {
      return `${getServerUrl()}${posterPath}`;
    }
    return posterPath;
  };

  const getCastUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/150";
    if (imagePath.startsWith("/uploads")) {
      return `${getServerUrl()}${imagePath}`;
    }
    return imagePath;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex justify-center items-center text-white">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-center items-center p-6">
        <span className="text-4xl mb-4">⚠️</span>
        <p className="text-red-500 font-semibold">{error || "Movie not found"}</p>
        <button
          onClick={() => navigate("/movies")}
          className="mt-6 bg-neutral-800 hover:bg-neutral-700 px-6 py-2 rounded-xl transition font-bold"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-16">
      {/* HERO BANNER SECTION */}
      <div className="relative h-[450px] w-full overflow-hidden border-b border-neutral-900">
        {/* Background Image Blurred */}
        <img
          src={getPosterUrl(movie.poster)}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover blur-md scale-105 opacity-20 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent"></div>

        {/* Foreground Content */}
        <div className="max-w-6xl mx-auto h-full px-6 flex flex-col sm:flex-row items-end pb-10 gap-8 relative z-10">
          <div className="w-40 sm:w-56 h-60 sm:h-80 bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl flex-shrink-0">
            <img
              src={getPosterUrl(movie.poster)}
              onError={(e) => (e.target.src = noImage)}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-grow pb-2">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3 capitalize bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              {movie.title}
            </h1>

            {/* Quick Metadata */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-neutral-400 mb-6">
              {movie.releaseYear && (
                <span className="bg-neutral-900 px-2.5 py-1 rounded-md border border-neutral-850">
                  {movie.releaseYear}
                </span>
              )}
              {movie.duration && (
                <span className="bg-neutral-900 px-2.5 py-1 rounded-md border border-neutral-850">
                  {movie.duration} mins
                </span>
              )}
              {movie.language && (
                <span className="bg-neutral-900 px-2.5 py-1 rounded-md border border-neutral-850 uppercase tracking-wider text-red-500">
                  {movie.language}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleWatch}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl transition duration-200 shadow-lg shadow-red-600/25 flex items-center gap-2 cursor-pointer"
              >
                <span className="text-lg">▶</span> Play Movie
              </button>
              <button
                onClick={handleDownload}
                className="bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-white font-bold px-6 py-3 rounded-xl transition flex items-center gap-2 cursor-pointer"
              >
                <span>⬇️</span> Download Offline
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED CONTENT SECTION */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
        {/* Left 2 Cols: Details */}
        <div className="lg:col-span-2 space-y-8">
          {movie.video && (
            <div>
              <h2 className="text-xl font-bold border-b border-neutral-900 pb-3 mb-4 text-neutral-200">
                Watch Movie Video
              </h2>
              <div className="w-full aspect-video rounded-2xl overflow-hidden border border-neutral-850 bg-black shadow-2xl relative">
                <video
                  src={`${getServerUrl()}${movie.video}`}
                  controls
                  className="w-full h-full object-contain"
                  poster={getPosterUrl(movie.poster)}
                />
              </div>
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold border-b border-neutral-900 pb-3 mb-4 text-neutral-200">
              Synopsis
            </h2>
            <p className="text-neutral-400 leading-relaxed text-sm">
              {movie.description}
            </p>
          </div>

          {/* Categories list */}
          <div>
            <h2 className="text-xl font-bold border-b border-neutral-900 pb-3 mb-4 text-neutral-200">
              Categories
            </h2>
            <div className="flex flex-wrap gap-3">
              {movie.categoryId && movie.categoryId.length > 0 ? (
                movie.categoryId.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/movies?category=${cat._id}`}
                    className="text-xs bg-neutral-900 hover:bg-neutral-850 text-red-400 border border-neutral-800 hover:border-neutral-700 px-3.5 py-1.5 rounded-full transition font-semibold"
                  >
                    📂 {cat.name}
                  </Link>
                ))
              ) : (
                <span className="text-xs text-neutral-500">Uncategorized</span>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Cast members */}
        <div>
          <h2 className="text-xl font-bold border-b border-neutral-900 pb-3 mb-4 text-neutral-200">
            Starring Cast
          </h2>
          <div className="space-y-4">
            {movie.cast && movie.cast.length > 0 ? (
              movie.cast.map((actor) => (
                <div
                  key={actor._id}
                  onClick={() => navigate(`/cast/${actor._id}`)}
                  className="flex items-center gap-4 bg-neutral-900 hover:bg-neutral-850 p-3 rounded-2xl border border-neutral-850 hover:border-neutral-750 transition cursor-pointer"
                >
                  <img
                    src={getCastUrl(actor.image)}
                    alt={actor.name}
                    className="w-12 h-12 rounded-full object-cover border border-neutral-800"
                  />
                  <div className="min-w-0 flex-grow">
                    <h4 className="font-bold text-sm truncate text-neutral-200 hover:text-red-500 transition">
                      {actor.name}
                    </h4>
                    {actor.age && (
                      <p className="text-neutral-500 text-xs">Age: {actor.age}</p>
                    )}
                  </div>
                  <span className="text-neutral-600 text-xs font-bold">➔</span>
                </div>
              ))
            ) : (
              <span className="text-xs text-neutral-500">No cast members listed</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;