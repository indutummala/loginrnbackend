require("dotenv").config()
const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes")

const app = express()

// ✅ Connect to MongoDB
connectDB()

// ✅ Middleware
app.use(express.json())

// ✅ Configure CORS properly to allow requests from your app
app.use(
  cors({
    // Allow requests from any origin during development
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

// ✅ Debugging Middleware
app.use((req, res, next) => {
  console.log(`📡 Incoming Request: ${req.method} ${req.url}`)
  console.log(`📡 Request Headers:`, req.headers)
  if (req.body && Object.keys(req.body).length > 0) {
    // Don't log passwords
    const sanitizedBody = { ...req.body }
    if (sanitizedBody.password) sanitizedBody.password = "***"
    console.log(`📡 Request Body:`, sanitizedBody)
  }
  next()
})

// ✅ Routes
app.use("/api/auth", authRoutes)

// ✅ Root route for basic connectivity testing
app.get("/", (req, res) => {
  res.json({ message: "API is running", timestamp: new Date().toISOString() })
})

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err)
  res.status(500).json({ message: "Server Error", error: err.message })
})

// ✅ Start Server
const PORT = process.env.PORT || 5000
// Listen on all network interfaces
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`🔗 Local: http://localhost:${PORT}`)
  console.log(`🌐 Network: Make sure your device can reach this server`)

  // Print the server's IP addresses to help with configuration
  const { networkInterfaces } = require("os")
  const nets = networkInterfaces()

  console.log("\n🌐 Available on these addresses:")
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip internal and non-IPv4 addresses
      if (net.family === "IPv4" && !net.internal) {
        console.log(`   http://${net.address}:${PORT}`)
      }
    }
  }
})

