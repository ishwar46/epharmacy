import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      console.log("Login successful:", data);

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("userRole", data.data.role);

      if (data.data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cyan-100 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <img
            src="https://i.ibb.co/RGtZpS0q/fixpharmacy.png"
            alt="Logo"
            className="h-40 w-auto"
          />
        </div>

        {/* Headings */}
        <h2 className="text-3xl font-semibold text-gray-800 mb-2 text-center">
          Welcome Back!
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Please sign in to your FixPharmacy account
        </p>

        {/* Display error if any */}
        {error && (
          <div className="mb-4 rounded bg-red-100 py-2 px-3 text-red-700">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="inline-flex items-center text-gray-600">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-600"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <span className="ml-2">Remember Me</span>
            </label>
            <a
              href="#"
              className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
            >
              Forgot password?
            </a>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </form>

        {/* Footer Text */}
        <p className="text-center mt-6 text-gray-500">
          Don’t have an account?{" "}
          <a
            href="#"
            className="text-blue-600 hover:text-blue-500 transition-colors"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
