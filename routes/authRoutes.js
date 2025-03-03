const express = require("express")
const { registerUser, loginUser } = require("../controllers/authController")

const router = express.Router()

// Add a simple ping endpoint to test connectivity
router.get("/ping", (req, res) => {
  res.json({ message: "Server is running", timestamp: new Date().toISOString() })
})

// ✅ User Registration
router.post("/register", registerUser)

// ✅ User Login
router.post("/login", loginUser)

module.exports = router

