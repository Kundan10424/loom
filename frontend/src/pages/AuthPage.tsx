import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Added
import Navbar from "../components/Navbar";
import { FaGoogle, FaGithub } from "react-icons/fa";
import axiosInstance from "../api/axiosInstance";
import {toast} from "react-toastify";

const AuthPage: React.FC = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showText, setShowText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ initialize navigation

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
      if (res.status === 201 || res.data?.success) {
        toast.success("Signup successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } else {
      const res = await axiosInstance.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      if (res.status === 200 || res.data?.success) {
        toast.success("Login successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    }
  } catch (err: any) {
    console.error(err);
    const msg = err.response?.data?.error || "Something went wrong";
    setError(msg);
    toast.error(msg);
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--page-bg)", color: "var(--text-color)" }}
    >
      <Navbar />

      {/* Desktop / Tablet Layout */}
      <div className="hidden md:flex flex-1 items-center justify-center">
        <div
          className="w-[900px] h-[520px] relative rounded-3xl shadow-2xl overflow-hidden transition-all duration-700"
          style={{ backgroundColor: "var(--card-bg)" }}
        >
          {/* Form Panel */}
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
              <LoginForm {...{ formData, handleChange, loading, error }} />
            ) : (
              <SignupForm {...{ formData, handleChange, loading, error }} />
            )}
          </form>

          {/* Text Panel */}
          {showText && (
            <div
              className={`absolute top-0 h-full w-1/2 p-8 flex flex-col justify-center items-center transition-opacity duration-500 ease-in-out
                ${isSignup ? "left-0 opacity-100" : "right-0 opacity-100"}
                rounded-2xl shadow-lg`}
              style={{ backgroundColor: "var(--navbar-bg)", color: "var(--text-color)" }}
            >
              {!isSignup ? (
                <>
                  <img src="./signup.jpg" alt="" className="w-32 h-32 mb-4 rounded-xl" />
                  <p className="text-xl mb-3 text-center">Don't have an account?</p>
                  <button onClick={handleToggle} className="underline font-semibold hover:opacity-80 mb-3">
                    Create one
                  </button>
                </>
              ) : (
                <>
                  <img src="./login.jpg" alt="" className="w-32 h-32 mb-4 rounded-xl" />
                  <p className="text-xl mb-3 text-center">Already have an account?</p>
                  <button onClick={handleToggle} className="underline font-semibold hover:opacity-80 mb-3">
                    Login
                  </button>
                </>
              )}

              <OAuthButtons />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout (Flipping Card) */}
      <div className="flex md:hidden flex-1 items-center justify-center p-6">
        <div className="relative w-full max-w-sm h-[450px] perspective">
          <div
            className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
              isSignup ? "rotate-y-180" : ""
            }`}
          >
            {/* Front: Login */}
            <div
              className="absolute w-full h-full backface-hidden flex flex-col justify-center p-6 rounded-2xl shadow-xl"
              style={{
                backgroundColor: "var(--card-bg)",
                color: "var(--text-color)",
              }}
            >
              <LoginForm {...{ formData, handleChange, loading, error }} />
              <p className="text-center mt-4 text-sm">
                Don’t have an account?{" "}
                <button onClick={handleToggle} className="underline font-semibold">
                  Sign up
                </button>
              </p>
              <OAuthButtons />
            </div>

            {/* Back: Signup */}
            <div
              className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col justify-center p-6 rounded-2xl shadow-xl"
              style={{
                backgroundColor: "var(--card-bg)",
                color: "var(--text-color)",
              }}
            >
              <SignupForm {...{ formData, handleChange, loading, error }} />
              <p className="text-center mt-4 text-sm">
                Already have an account?{" "}
                <button onClick={handleToggle} className="underline font-semibold">
                  Login
                </button>
              </p>
              <OAuthButtons />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 🧩 Sub-components for reuse
const LoginForm = ({ formData, handleChange, loading, error }: any) => (
  <div className="flex flex-col space-y-4 max-w-sm w-full">
    <h2 className="text-3xl font-bold mb-4 text-center">Login</h2>
    <input
      name="email"
      value={formData.email}
      onChange={handleChange}
      type="email"
      placeholder="Email"
      className="p-3 rounded-lg border bg-transparent focus:outline-none focus:ring-2"
      required
    />
    <input
      name="password"
      value={formData.password}
      onChange={handleChange}
      type="password"
      placeholder="Password"
      className="p-3 rounded-lg border bg-transparent focus:outline-none focus:ring-2"
      required
    />
    {error && <p className="text-red-500">{error}</p>}
    <button
      type="submit"
      disabled={loading}
      className="p-3 rounded-lg font-semibold"
      style={{ backgroundColor: "var(--navbar-bg)", color: "var(--text-color)" }}
    >
      {loading ? "Loading..." : "Login"}
    </button>
  </div>
);

const SignupForm = ({ formData, handleChange, loading, error }: any) => (
  <div className="flex flex-col space-y-4 max-w-sm w-full">
    <h2 className="text-3xl font-bold mb-4 text-center">Sign Up</h2>
    <input
      name="username"
      value={formData.username}
      onChange={handleChange}
      type="text"
      placeholder="Username"
      className="p-3 rounded-lg border bg-transparent focus:outline-none focus:ring-2"
      required
    />
    <input
      name="email"
      value={formData.email}
      onChange={handleChange}
      type="email"
      placeholder="Email"
      className="p-3 rounded-lg border bg-transparent focus:outline-none focus:ring-2"
      required
    />
    <input
      name="password"
      value={formData.password}
      onChange={handleChange}
      type="password"
      placeholder="Password"
      className="p-3 rounded-lg border bg-transparent focus:outline-none focus:ring-2"
      required
    />
    {error && <p className="text-red-500">{error}</p>}
    <button
      type="submit"
      disabled={loading}
      className="p-3 rounded-lg font-semibold"
      style={{ backgroundColor: "var(--navbar-bg)", color: "var(--text-color)" }}
    >
      {loading ? "Loading..." : "Create Account"}
    </button>
  </div>
);

const OAuthButtons = () => (
  <div className="flex gap-4 justify-center mt-3">
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
);

export default AuthPage;
