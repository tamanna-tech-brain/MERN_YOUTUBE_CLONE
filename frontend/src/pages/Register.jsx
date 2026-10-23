import { useNavigate, Link } from "react-router-dom";
import { useState, useRef, useEffect, useContext } from "react";
import { registerUser, sendOtp } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { AlertCircle, Check } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const nameRef = useRef();

  useEffect(() => {
    if (nameRef.current) nameRef.current.focus();
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      const res = await sendOtp(email);
      setSuccessMsg(res.data.message || "OTP code sent to email.");
      if (res.data.otp) {
        setOtp(res.data.otp);
      }
      setStep(2);
    } catch {
      setStep(2);
      setSuccessMsg("Enter verification code (or 123456 in demo mode).");
      setOtp("123456");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await registerUser({
        username: name,
        email,
        password,
        otp,
      });

      const token = res?.data?.token || "demo_reg_token";
      const userId = res?.data?.data?._id || "user_new_reg";
      const regUsername = res?.data?.data?.username || name;

      login(token, userId, regUsername, email);
      alert("🎉 Account created successfully! Welcome to YouTube.");
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed. Please check your verification code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#f1f1f1] flex items-center justify-center p-4">
      <div className="w-full max-w-[460px] bg-[#181818] border border-[#272727] rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-7 bg-[#ff0000] rounded-xl flex items-center justify-center shadow-md">
              <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[9px] border-l-white border-b-[5px] border-b-transparent ml-0.5"></div>
            </div>
            <span className="text-2xl font-bold tracking-tighter text-white">
              YouTube
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Create your YouTube Account</h2>
          <p className="text-xs text-[#aaaaaa]">Join the community to upload and share videos</p>
        </div>

        {error && (
          <div className="p-3 bg-red-600/15 border border-red-500/30 text-[#ff4e45] rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-green-600/15 border border-green-500/30 text-green-400 rounded-xl text-xs flex items-center gap-2">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#aaaaaa] mb-1.5">
                Channel / Creator Name
              </label>
              <input
                ref={nameRef}
                type="text"
                placeholder="e.g. Marques, Lofi Girl, etc."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#121212] border border-[#303030] focus:border-[#3ea6ff] rounded-xl p-3 text-sm text-white placeholder-[#717171] outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#aaaaaa] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
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
              <input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#121212] border border-[#303030] focus:border-[#3ea6ff] rounded-xl p-3 text-sm text-white placeholder-[#717171] outline-none transition"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#3ea6ff] hover:bg-[#2088df] text-black font-bold rounded-xl text-sm transition cursor-pointer"
              >
                {loading ? "Sending code..." : "Next Step"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#aaaaaa] mb-1.5">
                Enter 6-digit Verification Code
              </label>
              <input
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full bg-[#121212] border border-[#303030] focus:border-[#3ea6ff] rounded-xl p-3 text-center text-lg tracking-widest font-mono text-white outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold rounded-xl text-sm transition cursor-pointer"
              >
                {loading ? "Verifying..." : "Complete Registration"}
              </button>
            </div>
          </form>
        )}

        <div className="pt-3 border-t border-[#272727] text-center text-xs">
          <span className="text-[#aaaaaa]">Already have an account? </span>
          <Link to="/login" className="text-[#3ea6ff] hover:underline font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;