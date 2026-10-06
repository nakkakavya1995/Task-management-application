import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/register", {
        name,
        email,
        password
      });

      console.log("REGISTER RESPONSE:", response.data);

      localStorage.setItem("token", response.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");

    } catch (error) {
      console.error("REGISTER ERROR:", error);

      setError(
        error.response?.data?.message ||
        "Unable to connect to server"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-card">

        <div className="register-brand">

          <div className="register-logo">
            ✓
          </div>

          <h1>TaskFlow</h1>

          <p>
            Manage your tasks efficiently
          </p>

        </div>

        <div className="register-heading">

          <h2>Create Your Account</h2>

          <p>
            Sign up to start managing your tasks.
          </p>

        </div>

        {error && (
          <div className="register-error">
            <span>⚠</span>
            <p>{error}</p>
          </div>
        )}

        <form
          onSubmit={handleRegister}
          className="register-form"
        >

          <div className="register-field">

            <label htmlFor="register-name">
              Full Name
            </label>

            <input
              id="register-name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

          </div>

          <div className="register-field">

            <label htmlFor="register-email">
              Email Address
            </label>

            <input
              id="register-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

          </div>

          <div className="register-field">

            <label htmlFor="register-password">
              Password
            </label>

            <input
              id="register-password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

          </div>

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        <div className="register-login">

          <p>
            Already have an account?{" "}
            <Link to="/login">
              Login
            </Link>
          </p>

        </div>

        <div className="register-footer">
          Secure & simple task management
        </div>

      </div>

    </div>
  );
}

export default Register;