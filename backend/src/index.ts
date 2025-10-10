import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import passport from './config/passport';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

// Config
import { setupSecurity } from './config/security';

// Routes
import authRoutes from "./routes/authRoutes";
import userRoutes from './routes/userRoutes';
import projectRoutes from './routes/projectRoutes';
import fileRoutes from './routes/fileRoutes';
import projectMemberRoutes from './routes/projectMemberRoutes';
import fileVersionRoutes from './routes/fileVersionRoutes';
import commentRoutes from './routes/commentRoutes';
import activityRoutes from './routes/activityRoutes';

// Socket Handlers
import registerSocketHandlers from './socket/socketHandlers';

dotenv.config();

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET!;
const app = express();

setupSecurity(app);

app.use(passport.initialize());
app.use(passport.session());

/* 🚀 ROUTES                         */

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/projects", projectMemberRoutes);
app.use("/api/file-versions", fileVersionRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/activities", activityRoutes);

app.get("/", (req, res) => {
  res.send("Localhost backend is running with modular security & sockets 🚀");
});


const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});


io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers["authorization"];
    if (!token) return next(new Error("Authentication error"));

    const actualToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
    const decoded = jwt.verify(actualToken, JWT_SECRET);
    (socket as any).user = decoded;
    next();
  } catch {
    console.log("❌ Invalid socket token");
    next(new Error("Authentication error"));
  }
});


registerSocketHandlers(io);


server.listen(PORT, () => {
  console.log(`🔥 Server running securely at http://localhost:${PORT}`);
});
