const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ User Registration Controller
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ username, email, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: "✅ User registered successfully" });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ User Login Controller
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "✅ Login successful", token, user: { id: user._id, email: user.email, username: user.username } });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
