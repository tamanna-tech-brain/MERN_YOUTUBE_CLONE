import { useEffect, useState, useRef } from "react";
import { getCastById, getServerUrl } from "../api/api";
import { useParams, useNavigate } from "react-router-dom";

const CastDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cast, setCast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      const fetchCast = async () => {
        try {
          setLoading(true);
          const res = await getCastById(id);
          setCast(res.data.data);
          hasFetched.current = true;
        } catch (err) {
          console.error(err);
          setError("Failed to load cast member information.");
        } finally {
          setLoading(false);
        }
      };
      fetchCast();
    }
  }, [id]);

  const getCastUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("/uploads")) {
      return `${getServerUrl()}${imagePath}`;
    }
    return imagePath;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex justify-center items-center text-white">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !cast) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-center items-center p-6">
        <span className="text-4xl mb-4">⚠️</span>
        <p className="text-red-500 font-semibold">{error || "Cast member not found"}</p>
        <button
          onClick={() => navigate("/cast")}
          className="mt-6 bg-neutral-800 hover:bg-neutral-700 px-6 py-2 rounded-xl transition font-bold"
        >
          Return to Cast List
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white py-12 px-6 flex justify-center items-center">
      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-850 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
          {/* PHOTO */}
          <div className="w-48 h-64 sm:w-56 sm:h-72 bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0 shadow-lg">
            {cast.image ? (
              <img
                src={getCastUrl(cast.image)}
                alt={cast.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg className="w-24 h-24 text-neutral-800" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0 1 12.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
              </svg>
            )}
          </div>

          {/* DETAILS */}
          <div className="flex-grow text-center md:text-left space-y-4">
            <div>
              <h2 className="text-3xl font-extrabold capitalize text-white mb-1.5">{cast.name}</h2>
              {cast.age && (
                <span className="inline-block bg-red-600/10 text-red-400 border border-red-500/20 text-xs font-bold px-3 py-1 rounded-full">
                  Age: {cast.age} Years Old
                </span>
              )}
            </div>

            <div>
              <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-1.5">Biography</h4>
              <p className="text-neutral-300 leading-relaxed text-sm">
                {cast.bio || "No biography details added for this member."}
              </p>
            </div>

            <div className="pt-6">
              <button
                onClick={() => navigate("/cast")}
                className="bg-neutral-850 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-bold px-5 py-2.5 rounded-xl transition cursor-pointer"
              >
                Back to Cast List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CastDetails;