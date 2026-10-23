import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AuthGuard from "./components/AuthGuard";

import Dashboard from "./pages/Dashboard";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import CreateMovie from "./pages/CreateMovie";
import UpdateMovie from "./pages/UpdateMovie";

import Cast from "./pages/Cast";
import CreateCast from "./pages/CreateCast";
import CastDetails from "./pages/CastDetails";
import UpdateCast from "./pages/UpdateCast";

import Category from "./pages/Category";
import CreateCategory from "./pages/CreateCategory";
import CategoryDetails from "./pages/CategoryDetails";
import UpdateCategory from "./pages/UpdateCategory";

import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";

import History from "./pages/History";
import Download from "./pages/Download";

function App() {
  const location = useLocation();

  const isWatchPage = location.pathname.startsWith("/movie/") && !location.pathname.includes("/create") && !location.pathname.includes("/update");
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#f1f1f1] flex flex-col font-sans">
      
      <Navbar />

      <div className="flex flex-1">
        
        {!isWatchPage && !isAuthPage && <Sidebar />}

        
        <main className="flex-1 w-full overflow-x-hidden">
          <Routes>
            
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movie/:id" element={<MovieDetails />} />

            
            <Route path="/cast" element={<Cast />} />
            <Route path="/cast/:id" element={<CastDetails />} />
            <Route path="/cast/create" element={<AuthGuard><CreateCast /></AuthGuard>} />
            <Route path="/cast/update/:id" element={<AuthGuard><UpdateCast /></AuthGuard>} />

            
            <Route path="/category" element={<Category />} />
            <Route path="/category/:id" element={<CategoryDetails />} />
            <Route path="/category/create" element={<AuthGuard><CreateCategory /></AuthGuard>} />
            <Route path="/category/update/:id" element={<AuthGuard><UpdateCategory /></AuthGuard>} />

            
            <Route path="/history" element={<AuthGuard><History /></AuthGuard>} />
            <Route path="/downloads" element={<AuthGuard><Download /></AuthGuard>} />

            
            <Route path="/movie/create" element={<AuthGuard><CreateMovie /></AuthGuard>} />
            <Route path="/movie/update/:id" element={<AuthGuard><UpdateMovie /></AuthGuard>} />

            
            <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;