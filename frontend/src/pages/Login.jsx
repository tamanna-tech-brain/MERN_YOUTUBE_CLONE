import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { loginUser } from "../api/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser({ email, password });
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.data._id);

      navigate("/movies");
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-neutral-900/80 backdrop-blur-xl p-8 rounded-2xl border border-neutral-800 shadow-2xl z-10">
        <h2 className="text-3xl font-extrabold text-center mb-2 tracking-tight">
          Welcome Back
        </h2>
        <p className="text-neutral-400 text-sm text-center mb-6">
          Sign in to access your watchlists and history
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/15 border border-red-500/30 text-red-400 rounded-lg text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              ref={emailRef}
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition duration-200"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 py-3 rounded-lg font-bold transition duration-200 flex justify-center items-center gap-2 text-white mt-6 shadow-lg shadow-red-600/10 cursor-pointer"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-6 text-neutral-500 text-sm">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-red-400 font-semibold cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;