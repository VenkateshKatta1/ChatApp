import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const allowedOrigins = [
  "http://localhost:5173", // Dev URL
  "https://chatapp-grib.onrender.com", // Production URL
];
const io = new Server(server, {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST"],
  credentials: true,
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketmap[receiverId];
};

const userSocketmap = {};
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId !== "undefined") userSocketmap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketmap));

  socket.on("disconnect", () => {
    delete userSocketmap[userId],
      io.emit("getOnlineUsers", Object.keys(userSocketmap));
  });
});

export { app, io, server };
