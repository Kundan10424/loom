import { Server, Socket } from "socket.io";

interface ActiveUsersMap {
  [projectId: string]: Set<string>;
}

const activeUsers: ActiveUsersMap = {};

export default function registerSocketHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    const user = (socket as any).user;

    console.log(`🟢 ${user.email || user.id} connected (${socket.id})`);

    // --- JOIN PROJECT ---
    socket.on("join_project", (projectId: string) => {
      socket.join(projectId);

      if (!activeUsers[projectId]) activeUsers[projectId] = new Set();
      activeUsers[projectId].add(user.email || user.id);

      io.to(projectId).emit("user_joined", {
        user: user.email || user.id,
        activeUsers: Array.from(activeUsers[projectId]),
      });

      console.log(`👥 ${user.email || user.id} joined project ${projectId}`);
    });

    // --- CURSOR UPDATE ---
    socket.on("cursor_update", ({ projectId, fileId, position }) => {
      socket.to(projectId).emit("cursor_update", {
        user: user.email || user.id,
        fileId,
        position,
      });
    });

    // --- CODE CHANGES (Realtime Collaboration) ---
    socket.on("code_change", ({ projectId, fileId, content }) => {
      socket.to(projectId).emit("receive_code_change", {
        user: user.email || user.id,
        fileId,
        content,
      });
    });

    // --- DISCONNECT ---
    socket.on("disconnecting", () => {
      const rooms = Array.from(socket.rooms).filter((r) => r !== socket.id);

      rooms.forEach((projectId) => {
        if (activeUsers[projectId]) {
          activeUsers[projectId].delete(user.email || user.id);
          io.to(projectId).emit("user_left", {
            user: user.email || user.id,
            activeUsers: Array.from(activeUsers[projectId]),
          });
        }
      });
    });

    socket.on("disconnect", () => {
      console.log(`🔴 ${user.email || user.id} disconnected`);
    });
  });
}
