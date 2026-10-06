
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const admin = require("../firebaseAdmin");

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d"
    }
  );
};
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }
const normalizedEmail = email
      .trim()
      .toLowerCase();
    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword
    });
    const token = generateToken(user._id);

    return res.status(201).json({
      message: "Registration successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error(
      "REGISTER ERROR:",
      error
    );

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }
    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }
    const token = generateToken(user._id);

    return res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error(
      "LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { firebaseToken } = req.body;
    if (!firebaseToken) {
      return res.status(400).json({
        message: "Firebase token is required"
      });
    }

    console.log(
      "Verifying Firebase token..."
    );
    const decodedToken =
  await admin.verifyIdToken(firebaseToken);

    console.log(
      "Firebase token verified successfully"
    );

    const email = decodedToken.email;
    if (!email) {
      return res.status(400).json({
        message: "Google account email not found"
      });
    }
 const normalizedEmail =
      email.trim().toLowerCase();

    const name =
      decodedToken.name ||
      normalizedEmail.split("@")[0];
    let user = await User.findOne({
      email: normalizedEmail
    });
    if (!user) {
      console.log("Google user not found. Creating new user...");

      const randomPassword =
        Math.random().toString(36) +
        Date.now().toString();

      const hashedPassword =
        await bcrypt.hash(
          randomPassword,
          10
        );

      user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword
      });

      console.log(
        "Google user created successfully"
      );
    } else {
      console.log(
        "Existing Google user found"
      );
    }
    const token =
      generateToken(user._id);

    console.log(
      "Backend JWT generated successfully"
    );

    return res.status(200).json({
      message: "Google login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error(
      "GOOGLE LOGIN ERROR:",
      error
    );

    return res.status(401).json({
      message: "Invalid or expired Google token"
    });
  }
};
module.exports = {
  register,
  login,
  googleLogin
};
