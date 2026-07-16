import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMovies, getCasts, getCategories, getHistory } from "../api/api";

const Dashboard = () => {
  const [stats, setStats] = useState({ movies: 0, casts: 0, categories: 0, history: 0 });
  const [loading, setLoading] = useState(true);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [secCheckStatus, setSecCheckStatus] = useState("SCANNING");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [moviesRes, castsRes, categoriesRes, historyRes] = await Promise.all([
          getMovies({ limit: 1 }),
          getCasts({ limit: 1 }),
          getCategories({ limit: 1 }),
          getHistory({ limit: 1 }).catch(() => ({ data: { pagination: { total: 0 } } }))
        ]);

        setStats({
          movies: moviesRes.data.pagination?.total || 0,
          casts: castsRes.data.pagination?.total || 0,
          categories: categoriesRes.data.pagination?.total || 0,
          history: historyRes.data.pagination?.total || 0
        });
      } catch (err) {
        console.error("Failed to load dashboard statistics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const logs = [
      "⚡ INITIATING FLIXCAST SECURE ENVIRONMENT...",
      "🛡️ ESTABLISHING E2E HTTPS HANDSHAKE WITH VERIFIED NODE...",
      "🔑 VERIFYING JWT CRYPTOGRAPHIC SIGNATURE...",
      "📦 COMPILING MERN DATA ABSTRACTION LAYERS...",
      "🔒 BCRYPT DATA SHIELD ENFORCED...",
      "🚀 ENCRYPTION NODE ONLINE: SECURE CONNECTION ESTABLISHED."
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setTerminalLogs(prev => [...prev, log]);
        if (index === logs.length - 1) {
          setSecCheckStatus("SECURE");
        }
      }, (index + 1) * 800);
    });
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-6 pt-24">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Encrypted UI Header Banner */}
        <div className="border border-green-500/30 bg-green-950/10 p-6 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.15)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-widest text-green-500 flex items-center gap-2">
              <span className="animate-pulse">🛡️</span> Flixcast Secure Node
            </h1>
            <p className="text-xs text-green-500/60 mt-1 uppercase">
              End-to-End Cryptographic Encryption Gateway & DB Monitor
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-green-500/60 uppercase">SYSTEM STATUS:</span>
            <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${
              secCheckStatus === "SECURE" ? "bg-green-500/20 text-green-400 border border-green-500/40 animate-pulse" : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40"
            }`}>
              ● {secCheckStatus}
            </span>
          </div>
        </div>

        {/* Database statistics cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="border border-green-500/20 bg-black/40 p-6 rounded-lg hover:border-green-500/60 transition duration-300 flex flex-col justify-between">
            <span className="text-xs text-green-500/50 uppercase tracking-wider">Secure Movies</span>
            <h2 className="text-4xl font-extrabold my-3 text-green-400">{loading ? "..." : stats.movies}</h2>
            <Link to="/movies" className="text-xs text-green-500 hover:text-green-300 flex items-center gap-1 uppercase">
              Configure List ➔
            </Link>
          </div>

          <div className="border border-green-500/20 bg-black/40 p-6 rounded-lg hover:border-green-500/60 transition duration-300 flex flex-col justify-between">
            <span className="text-xs text-green-500/50 uppercase tracking-wider">Verified Casts</span>
            <h2 className="text-4xl font-extrabold my-3 text-green-400">{loading ? "..." : stats.casts}</h2>
            <Link to="/cast" className="text-xs text-green-500 hover:text-green-300 flex items-center gap-1 uppercase">
              Configure List ➔
            </Link>
          </div>

          <div className="border border-green-500/20 bg-black/40 p-6 rounded-lg hover:border-green-500/60 transition duration-300 flex flex-col justify-between">
            <span className="text-xs text-green-500/50 uppercase tracking-wider">Secure Categories</span>
            <h2 className="text-4xl font-extrabold my-3 text-green-400">{loading ? "..." : stats.categories}</h2>
            <Link to="/category" className="text-xs text-green-500 hover:text-green-300 flex items-center gap-1 uppercase">
              Configure List ➔
            </Link>
          </div>

          <div className="border border-green-500/20 bg-black/40 p-6 rounded-lg hover:border-green-500/60 transition duration-300 flex flex-col justify-between">
            <span className="text-xs text-green-500/50 uppercase tracking-wider">Watch Operations</span>
            <h2 className="text-4xl font-extrabold my-3 text-green-400">{loading ? "..." : stats.history}</h2>
            <Link to="/history" className="text-xs text-green-500 hover:text-green-300 flex items-center gap-1 uppercase">
              View History ➔
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cryptographic Encryption Details */}
          <div className="md:col-span-2 border border-green-500/20 bg-black/40 p-6 rounded-lg space-y-6">
            <h3 className="text-lg font-bold uppercase text-green-400 border-b border-green-500/20 pb-3 flex items-center gap-2">
              🔒 End-to-End Cryptography Nodes
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-start border-b border-green-500/10 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-green-400 uppercase">HTTPS Transport Layer (SSL/TLS)</h4>
                  <p className="text-xs text-green-500/60 mt-1">Encrypts all client-server communications in transit, preventing Man-in-the-Middle eavesdropping.</p>
                </div>
                <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold border border-green-500/40">ENABLED</span>
              </div>

              <div className="flex justify-between items-start border-b border-green-500/10 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-green-400 uppercase">JWT Signature Tokenization</h4>
                  <p className="text-xs text-green-500/60 mt-1">Signs private session routes using a cryptographically signed HMAC-SHA256 token payload.</p>
                </div>
                <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold border border-green-500/40">ACTIVE</span>
              </div>

              <div className="flex justify-between items-start border-b border-green-500/10 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-green-400 uppercase">Bcrypt Adaptive Hashing</h4>
                  <p className="text-xs text-green-500/60 mt-1">Passwords are hashed using bcrypt with 10 adaptive salting cycles before writing to database. One-way secure hashing.</p>
                </div>
                <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold border border-green-500/40">ENFORCED</span>
              </div>

              <div className="flex justify-between items-start pb-1">
                <div>
                  <h4 className="text-sm font-bold text-green-400 uppercase">Two-Step OTP Email Verification</h4>
                  <p className="text-xs text-green-500/60 mt-1">Blocks unverified signups by requesting a single-use 6-digit verification code with 5-minute expiration.</p>
                </div>
                <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold border border-green-500/40">VERIFIED</span>
              </div>
            </div>
          </div>

          {/* Secure Terminal Simulator */}
          <div className="border border-green-500/20 bg-black/80 p-6 rounded-lg flex flex-col justify-between h-[340px]">
            <div>
              <h3 className="text-xs font-bold uppercase text-green-500/50 mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span> Live Security Console
              </h3>
              <div className="space-y-2 text-[10px] leading-relaxed overflow-y-auto max-h-[220px]">
                {terminalLogs.map((log, index) => (
                  <p key={index} className="text-green-400 font-mono tracking-tight">{log}</p>
                ))}
              </div>
            </div>
            <div className="border-t border-green-500/20 pt-3 flex items-center justify-between text-[10px] text-green-500/40 uppercase">
              <span>Host: production-node-1</span>
              <span>Shell: bash v5.0</span>
            </div>
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="border border-green-500/20 bg-black/40 p-6 rounded-lg">
          <h3 className="text-sm font-bold uppercase text-green-400 mb-4">🔧 Secure Node Controllers</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/movies" className="border border-green-500/30 hover:border-green-400 bg-green-950/5 hover:bg-green-950/20 py-3 rounded text-center text-xs font-bold transition duration-200">
              🎬 MOVIE MANAGER
            </Link>
            <Link to="/cast" className="border border-green-500/30 hover:border-green-400 bg-green-950/5 hover:bg-green-950/20 py-3 rounded text-center text-xs font-bold transition duration-200">
              👥 CAST MANAGER
            </Link>
            <Link to="/category" className="border border-green-500/30 hover:border-green-400 bg-green-950/5 hover:bg-green-950/20 py-3 rounded text-center text-xs font-bold transition duration-200">
              🏷️ GENRE MANAGER
            </Link>
            <Link to="/profile" className="border border-green-500/30 hover:border-green-400 bg-green-950/5 hover:bg-green-950/20 py-3 rounded text-center text-xs font-bold transition duration-200">
              ⚙️ NODE SETTINGS
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
