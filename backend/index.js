import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./DB/dbConnect.js";
import authRouter from "./route/authUser.js";
import messageRouter from "./route/messageRoute.js";
import cookieParser from "cookie-parser";
import userRouter from "./route/userRoute.js";
// import path from "path";

import { app, server } from "./Socket/socket.js";

// const __dirname = path.resolve();

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL/
    credentials: true, // This allows cookies to be sent and received
  })
);

app.use("/auth", authRouter);
app.use("/message", messageRouter);
app.use("/user", userRouter);

// app.use(express.static(path.join(__dirname, "/frontend/dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
// });

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  dbConnect();
  console.log(`Server started at ${PORT}`);
});
