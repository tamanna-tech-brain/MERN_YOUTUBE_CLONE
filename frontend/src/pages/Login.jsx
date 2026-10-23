import { useNavigate, Link } from "react-router-dom";
import { useState, useRef, useEffect, useContext } from "react";
import { loginUser } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { Sparkles, AlertCircle, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const emailRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (emailRef.current) emailRef.current.focus();
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
      
      const token = res.data.token || "jwt_demo_token";
      const userId = res.data.data?._id || "user_demo_1";
      const username = res.data.data?.username || email.split("@")[0];

      login(token, userId, username, email);
      navigate("/");
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = () => {
    login("demo_token_authenticated", "demo_user_id_101", "Alex Rivers", "alex@youtube.dev");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#f1f1f1] flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] bg-[#181818] border border-[#272727] rounded-3xl p-8 shadow-2xl space-y-6">
        
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-7 bg-[#ff0000] rounded-xl flex items-center justify-center shadow-md">
              <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[9px] border-l-white border-b-[5px] border-b-transparent ml-0.5"></div>
            </div>
            <span className="text-2xl font-bold tracking-tighter text-white">
              YouTube
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Sign in</h2>
          <p className="text-xs text-[#aaaaaa]">to continue to YouTube Clone</p>
        </div>

        {error && (
          <div className="p-3 bg-red-600/15 border border-red-500/30 text-[#ff4e45] rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#aaaaaa] mb-1.5">
              Email or phone
            </label>
            <input
              ref={emailRef}
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#121212] border border-[#303030] focus:border-[#3ea6ff] rounded-xl p-3 text-sm text-white placeholder-[#717171] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#aaaaaa] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#121212] border border-[#303030] focus:border-[#3ea6ff] rounded-xl p-3 text-sm text-white placeholder-[#717171] outline-none transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaaaaa] hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#3ea6ff] hover:bg-[#2088df] text-black font-bold rounded-xl text-sm transition cursor-pointer"
            >
              {loading ? "Signing in..." : "Next / Sign In"}
            </button>
          </div>
        </form>

        
        <div className="pt-3 border-t border-[#272727] space-y-3">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 px-4 bg-[#272727] hover:bg-[#333333] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer border border-[#383838]"
          >
            <Sparkles className="w-4 h-4 text-[#ffcc00]" />
            <span>Instant Demo Sign In (One Click)</span>
          </button>

          <div className="flex justify-between items-center text-xs pt-1">
            <Link to="/register" className="text-[#3ea6ff] hover:underline font-semibold">
              Create account
            </Link>
            <Link to="/" className="text-[#aaaaaa] hover:text-white">
              Continue as guest
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;