const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const session = require("express-session");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);

// Environment variables (you can create a .env file later)
const JWT_SECRET = "your-super-secret-jwt-key-change-in-production";
const SESSION_SECRET = "your-super-secret-session-key-change-in-production";
const PORT = process.env.PORT || 3000;

// Database configuration
const dbConfig = {
  host: "localhost",
  user: "root", // Change to your MySQL username
  password: "", // Change to your MySQL password
  database: "chat",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create connection pool
let pool;

// Initialize database connection
async function initializeDatabase() {
  try {
    // Create connection pool to existing database
    pool = mysql.createPool(dbConfig);

    // Test connection
    await pool.execute("SELECT 1");

    // Temporarily disable foreign key checks for development
    await pool.execute("SET FOREIGN_KEY_CHECKS = 0");

    console.log("✅ Database connected successfully");
    console.log("📊 Connected to database:", dbConfig.database);
    console.log("⚠️  Foreign key checks temporarily disabled for development");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.log("📝 Make sure MySQL is running and database exists");
    console.log("📝 Database should be created in phpMyAdmin first");
    process.exit(1);
  }
}

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Vite dev server
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    // Check session first
    if (req.session && req.session.userId) {
      const [users] = await pool.execute(
        "SELECT id, username, email FROM users_chats WHERE id = ? AND is_active = TRUE",
        [req.session.userId]
      );

      if (users.length > 0) {
        req.user = users[0];
        return next();
      }
    }

    // Check JWT token in header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Access token required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const [users] = await pool.execute(
      "SELECT id, username, email FROM users_chats WHERE id = ? AND is_active = TRUE",
      [decoded.userId]
    );

    if (users.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    req.user = users[0];
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};

// Routes

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date(),
  });
});

// Register endpoint
app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email, and password are required",
      });
    }

    if (username.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Username must be at least 3 characters long",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists
    const [existingUsers] = await pool.execute(
      "SELECT id FROM users_chats WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Username or email already exists",
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const [result] = await pool.execute(
      "INSERT INTO users_chats (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, passwordHash]
    );

    const userId = result.insertId;

    // Create session
    req.session.userId = userId;

    // Create JWT token
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" });

    const user = {
      id: userId,
      username,
      email,
    };

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user by email
    const [users] = await pool.execute(
      "SELECT id, username, email, password_hash FROM users_chats WHERE email = ? AND is_active = TRUE",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Create session
    req.session.userId = user.id;

    // Create JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    res.json({
      success: true,
      message: "Login successful",
      user: userData,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
});

// Verify token endpoint
app.get("/api/verify", authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// Logout endpoint
app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({
        success: false,
        message: "Error during logout",
      });
    }

    res.clearCookie("connect.sid");
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  });
});

// Get chat messages (default room)
app.get("/api/messages", authenticateToken, async (req, res) => {
  try {
    const roomId = 1; // Default room
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const [messages] = await pool.execute(
      `
      SELECT 
        m.id,
        m.content,
        m.is_anonymous,
        m.created_at,
        u.id as user_id,
        u.username
      FROM messages m
      LEFT JOIN users_chats u ON m.user_id = u.id
      WHERE m.room_id = ?
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?
    `,
      [roomId, limit, offset]
    );

    res.json({
      success: true,
      messages: messages.reverse(), // Reverse to show chronological order
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching messages",
    });
  }
});

// Get chat messages (specific room)
app.get("/api/messages/:roomId", authenticateToken, async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const [messages] = await pool.execute(
      `
      SELECT 
        m.id,
        m.content,
        m.is_anonymous,
        m.created_at,
        u.id as user_id,
        u.username
      FROM messages m
      LEFT JOIN users_chats u ON m.user_id = u.id
      WHERE m.room_id = ?
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?
    `,
      [roomId, limit, offset]
    );

    res.json({
      success: true,
      messages: messages.reverse(), // Reverse to show chronological order
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching messages",
    });
  }
});

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.io authentication middleware
io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new Error("Authentication error"));
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const [users] = await pool.execute(
      "SELECT id, username, email FROM users_chats WHERE id = ? AND is_active = TRUE",
      [decoded.userId]
    );

    if (users.length === 0) {
      return next(new Error("User not found"));
    }

    socket.userId = users[0].id;
    socket.user = users[0];
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log(`✅ User ${socket.user.username} connected`);

  // Join room
  socket.on("join-room", (data) => {
    const roomId = data.roomId || 1;
    socket.join(roomId.toString()); // Convert to string for socket room
    console.log(`📢 ${socket.user.username} joined room: ${roomId}`);
  });

  // Handle new messages
  socket.on("send-message", async (data) => {
    try {
      const { content, isAnonymous, roomId = 1 } = data;

      if (!content || !content.trim()) {
        return;
      }

      // Save message to database
      const [result] = await pool.execute(
        "INSERT INTO messages (user_id, room_id, content, is_anonymous) VALUES (?, ?, ?, ?)",
        [socket.userId, roomId, content.trim(), isAnonymous || false]
      );

      const messageData = {
        id: result.insertId,
        content: content.trim(),
        username: isAnonymous ? "Anonymous" : socket.user.username,
        isAnonymous: isAnonymous || false,
        created_at: new Date(),
        userId: socket.userId,
      };

      // Broadcast to all users in the room
      io.to(roomId.toString()).emit("message", messageData);

      console.log(`💬 Message from ${socket.user.username}: ${content}`);
    } catch (error) {
      console.error("Error saving message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`❌ User ${socket.user.username} disconnected`);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

// Start server
async function startServer() {
  try {
    await initializeDatabase();

    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🔗 Frontend should connect to this URL`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
