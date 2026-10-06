
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../services/api";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", {
        email: email.trim(),
        password: password
      });

      console.log("LOGIN RESPONSE:", response.data);

      if (!response.data.token) {
        throw new Error("Login token was not received");
      }
      localStorage.setItem(
        "token",
        response.data.token
      );
      if (response.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );
      }
      navigate("/dashboard");

    } catch (error) {
      console.error("LOGIN ERROR:", error);

      console.error(
        "LOGIN SERVER RESPONSE:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
        error.message ||
        "Login failed"
      );

    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      console.log("STEP 1: Opening Google login...");
      const result = await signInWithPopup(
        auth,
        googleProvider
      );

      const googleUser = result.user;

      console.log(
        "STEP 2: Google login successful"
      );

      console.log(
        "Google UID:",
        googleUser.uid
      );

      console.log(
        "Google Email:",
        googleUser.email
      );
      const firebaseToken =
        await googleUser.getIdToken();

      console.log(
        "STEP 3: Firebase token received"
      );
      const response = await API.post(
        "/auth/google",
        {
          firebaseToken: firebaseToken
        }
      );

      console.log(
        "STEP 4: Backend response:",
        response.data
      );
      if (!response.data) {
        throw new Error(
          "No response received from backend"
        );
      }

      if (!response.data.token) {
        throw new Error(
          "Backend did not return JWT token"
        );
      }
      localStorage.setItem(
        "token",
        response.data.token
      );

      console.log(
        "STEP 5: Backend JWT saved"
      );
      if (response.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(
            response.data.user
          )
        );
      } else {
        localStorage.setItem(
          "user",
          JSON.stringify({
            name:
              googleUser.displayName ||
              "Google User",

            email:
              googleUser.email || "",

            photo:
              googleUser.photoURL || "",

            firebaseUid:
              googleUser.uid
          })
        );
      }
      localStorage.removeItem(
        "firebaseToken"
      );

      console.log(
        "STEP 6: User saved"
      );

      console.log(
        "STEP 7: Going to dashboard..."
      );

      // Go to dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error(
        "GOOGLE LOGIN ERROR:",
        error
      );

      console.error(
        "GOOGLE ERROR MESSAGE:",
        error.message
      );

      console.error(
        "GOOGLE BACKEND ERROR:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
        error.message ||
        "Google login failed"
      );

    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-brand">

          <div className="login-logo">
            ✓
          </div>

          <h1>
            TaskFlow
          </h1>

          <p>
            Manage your tasks efficiently
          </p>

        </div>

        <div className="login-heading">

          <h2>
            Welcome Back
          </h2>

          <p>
            Login to continue to your dashboard
          </p>

        </div>

        {error && (
          <div className="login-error">

            <span>
              ⚠
            </span>

            <p>
              {error}
            </p>

          </div>
        )}

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
              disabled={
                loading ||
                googleLoading
              }
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
              disabled={
                loading ||
                googleLoading
              }
            />

          </div>
          <button
            type="submit"
            className="login-button"
            disabled={
              loading ||
              googleLoading
            }
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        <div className="login-divider">

          <span>
            OR
          </span>

        </div>

        <button
          type="button"
          className="google-login-button"
          onClick={handleGoogleLogin}
          disabled={
            loading ||
            googleLoading
          }
        >

          <span className="google-icon">
            G
          </span>

          <span>
            {googleLoading
              ? "Signing in with Google..."
              : "Continue with Google"}
          </span>

        </button>

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
