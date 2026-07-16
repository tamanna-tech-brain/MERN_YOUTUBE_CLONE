import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserById, updateUserById } from "../api/api";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await getUserById(id);
      setUser(res.data.data);
      setUsername(res.data.data.username);
      setEmail(res.data.data.email);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch user details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !email) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setSubmitting(true);
      const res = await updateUserById(id, {
        username,
        email,
      });
      setUser(res.data.data); 
      setSuccess("🎉 Profile updated successfully!");
    } catch (error) {
      setError(error.message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <h2 className="text-xl font-bold animate-pulse text-red-500">Loading profile details...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex justify-center items-center py-12 px-4 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-2xl relative z-10">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-red-600 text-white font-black text-3xl flex items-center justify-center rounded-full mx-auto mb-3 shadow-lg shadow-red-600/20">
            {username ? username.charAt(0).toUpperCase() : "U"}
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Account Profile</h2>
          <p className="text-neutral-400 text-xs mt-1">Manage your Flixcast profile credentials</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl text-xs font-medium">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-3 bg-green-500/15 border border-green-500/30 text-green-400 rounded-xl text-xs font-medium">
            ✅ {success}
          </div>
        )}

        {user ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                Profile ID
              </label>
              <div className="w-full p-3 rounded-lg bg-neutral-950/60 border border-neutral-850/80 text-neutral-500 text-xs font-mono select-all">
                {user._id}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-650 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-650 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/movies")}
                className="w-1/3 bg-neutral-800 hover:bg-neutral-700 py-3 rounded-xl font-bold transition text-center text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="w-2/3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 py-3 rounded-xl font-bold transition text-center text-sm text-white shadow-lg cursor-pointer"
              >
                {submitting ? "Saving..." : "Update Settings"}
              </button>
            </div>
          </form>
        ) : (
          <p className="text-center text-neutral-500 text-sm">Failed to load user info.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;