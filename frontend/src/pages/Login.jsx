import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", {
        email,
        password
      });

      console.log("LOGIN RESPONSE:", response.data);

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");

    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setError(
        error.response?.data?.message ||
        "Unable to connect to server"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        {/* Logo / Brand */}

        <div className="login-brand">

          <div className="login-logo">
            ✓
          </div>

          <h1>TaskFlow</h1>

          <p>
            Manage your tasks efficiently
          </p>

        </div>

        {/* Login Heading */}

        <div className="login-heading">

          <h2>Welcome Back</h2>

          <p>
            Login to continue to your dashboard
          </p>

        </div>

        {/* Error */}

        {error && (
          <div className="login-error">
            <span>⚠</span>
            <p>{error}</p>
          </div>
        )}

        {/* Login Form */}

        <form
          onSubmit={handleLogin}
          className="login-form"
        >

          <div className="login-field">

            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>

          <div className="login-field">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {/* Register */}

        <div className="login-register">

          <p>
            Don't have an account?{" "}
            <Link to="/register">
              Create an account
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;