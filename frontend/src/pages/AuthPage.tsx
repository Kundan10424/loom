import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { FaGoogle, FaGithub } from "react-icons/fa";
import axiosInstance from "../api/axiosInstance";

const AuthPage: React.FC = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showText, setShowText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleToggle = () => {
    setShowText(false);
    setTimeout(() => {
      setIsSignup(!isSignup);
      setShowText(true);
      setError("");
      setFormData({ username: "", email: "", password: "" });
    }, 50);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isSignup) {
        const res = await axiosInstance.post("/auth/signup", formData);
        console.log(res.data);
      } else {
        const res = await axiosInstance.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        console.log(res.data);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--page-bg)", color: "var(--text-color)" }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Parent container */}
      <div className="flex flex-1 items-center justify-center">
        <div
          className="w-[900px] h-[520px] relative rounded-3xl shadow-2xl overflow-hidden transition-all duration-700"
          style={{ backgroundColor: "var(--card-bg)" }}
        >
          {/* Form panel */}
          <form
            onSubmit={handleSubmit}
            className={`absolute top-0 h-full w-1/2 p-8 flex flex-col justify-center items-center transition-transform duration-700 ease-in-out z-20
              ${isSignup ? "translate-x-[100%] scale-105" : "translate-x-0 scale-100"}
              rounded-2xl shadow-lg`}
            style={{
              backgroundColor: "rgba(255,255,255,0.3)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            {!isSignup ? (
              <div className="w-full max-w-sm flex flex-col space-y-4">
                <h2
                  className="text-3xl font-bold mb-6 text-center"
                  style={{ color: "var(--text-color)" }}
                >
                  Login
                </h2>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Email"
                  className="p-3 rounded-lg border bg-transparent placeholder-gray-700 focus:outline-none focus:ring-2"
                  style={{ borderColor: "var(--navbar-bg)", color: "var(--text-color)" }}
                  required
                />
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type="password"
                  placeholder="Password"
                  className="p-3 rounded-lg border bg-transparent placeholder-gray-700 focus:outline-none focus:ring-2"
                  style={{ borderColor: "var(--navbar-bg)", color: "var(--text-color)" }}
                  required
                />
                {error && <p className="text-red-500">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="p-3 rounded-lg font-semibold transition-colors duration-300"
                  style={{ backgroundColor: "var(--navbar-bg)", color: "var(--text-color)" }}
                >
                  {loading ? "Loading..." : "Login"}
                </button>
              </div>
            ) : (
              <div className="w-full max-w-sm flex flex-col space-y-4">
                <h2
                  className="text-3xl font-bold mb-6 text-center"
                  style={{ color: "var(--text-color)" }}
                >
                  Sign Up
                </h2>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  type="text"
                  placeholder="Username"
                  className="p-3 rounded-lg border bg-transparent placeholder-gray-700 focus:outline-none focus:ring-2"
                  style={{ borderColor: "var(--navbar-bg)", color: "var(--text-color)" }}
                  required
                />
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Email"
                  className="p-3 rounded-lg border bg-transparent placeholder-gray-700 focus:outline-none focus:ring-2"
                  style={{ borderColor: "var(--navbar-bg)", color: "var(--text-color)" }}
                  required
                />
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type="password"
                  placeholder="Password"
                  className="p-3 rounded-lg border bg-transparent placeholder-gray-700 focus:outline-none focus:ring-2"
                  style={{ borderColor: "var(--navbar-bg)", color: "var(--text-color)" }}
                  required
                />
                {error && <p className="text-red-500">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="p-3 rounded-lg font-semibold transition-colors duration-300"
                  style={{ backgroundColor: "var(--navbar-bg)", color: "var(--text-color)" }}
                >
                  {loading ? "Loading..." : "Create Account"}
                </button>
              </div>
            )}
          </form>

          {/* Text panel */}
          {showText && (
            <div
              className={`absolute top-0 h-full w-1/2 p-8 flex flex-col justify-center items-center transition-opacity duration-500 ease-in-out
                ${isSignup ? "left-0 opacity-100" : "right-0 opacity-100"}
                rounded-2xl shadow-lg`}
              style={{ backgroundColor: "var(--navbar-bg)", color: "var(--text-color)" }}
            >
              <img src="" alt="" className="w-32 h-32 mb-4" />
              {!isSignup ? (
                <>
                  <p className="text-xl mb-3 text-center">Don't have an account?</p>
                  <button
                    onClick={handleToggle}
                    className="underline font-semibold hover:opacity-80 mb-3"
                  >
                    Create one
                  </button>
                </>
              ) : (
                <>
                  <p className="text-xl mb-3 text-center">Already have an account?</p>
                  <button
                    onClick={handleToggle}
                    className="underline font-semibold hover:opacity-80 mb-3"
                  >
                    Login
                  </button>
                </>
              )}

              {/* OAuth Icons */}
              <div className="flex gap-4 mt-2">
                <a
                  href="http://localhost:5000/api/auth/google"
                  className="p-3 rounded-full bg-white/80 text-black flex items-center justify-center hover:bg-white transition"
                >
                  <FaGoogle size={22} />
                </a>
                <a
                  href="http://localhost:5000/api/auth/github"
                  className="p-3 rounded-full bg-white/80 text-black flex items-center justify-center hover:bg-white transition"
                >
                  <FaGithub size={22} />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
