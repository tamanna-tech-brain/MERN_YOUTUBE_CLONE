import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { registerUser, sendOtp } from "../api/api";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  
  // step 1: enter details, step 2: enter otp
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();
  const nameRef = useRef();
  const otpRef = useRef();

  useEffect(() => {
    if (step === 1 && nameRef.current) {
      nameRef.current.focus();
    } else if (step === 2 && otpRef.current) {
      otpRef.current.focus();
    }
  }, [step]);

  // Request OTP code
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
        setSuccessMsg("✅ [Dev Mode] OTP auto-filled: " + res.data.otp);
      }
      setStep(2);
    } catch (err) {
      setError(err.message || "Failed to send OTP. Please check details.");
    } finally {
      setLoading(false);
    }
  };

  // Complete registration
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await registerUser({
        username: name,
        email,
        password,
        otp
      });

      setSuccessMsg("🎉 Account registered successfully!");
      localStorage.setItem("userId", res.data.data._id);
      
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.message || "Verification failed. Invalid OTP.");
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
          Create Account
        </h2>
        <p className="text-neutral-400 text-sm text-center mb-6">
          {step === 1 ? "Sign up to start watching premium content" : "Verify your email to complete signup"}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/15 border border-red-500/30 text-red-400 rounded-lg text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-green-500/15 border border-green-500/30 text-green-400 rounded-lg text-sm font-medium">
            ✅ {successMsg}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <input
                ref={nameRef}
                type="text"
                placeholder="JohnDoe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
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
              {loading ? "Sending OTP..." : "Get Verification OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                Enter 6-Digit OTP code
              </label>
              <input
                ref={otpRef}
                type="text"
                maxLength="6"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 text-center tracking-[10px] text-2xl font-bold focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition duration-200"
                required
              />
              <p className="text-xs text-neutral-500 mt-2 text-center">
                We sent a 6-digit verification code to <span className="text-neutral-300 font-semibold">{email}</span>.
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 bg-neutral-800 hover:bg-neutral-700 py-3 rounded-lg font-bold transition duration-200 cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 py-3 rounded-lg font-bold transition duration-200 flex justify-center items-center gap-2 text-white shadow-lg shadow-red-600/10 cursor-pointer"
              >
                {loading ? "Verifying..." : "Verify & Sign Up"}
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleSendOtp}
                className="text-xs text-red-400 hover:underline hover:text-red-300 cursor-pointer"
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}

        <p className="text-center mt-6 text-neutral-500 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-red-500 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;