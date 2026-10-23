import http from "http";
import { Server } from "socket.io";
import connectDB from "./db.js";
import app from "./app.js";
import config from "./config/config.js";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  socket.on("join-video", (videoId) => {
    socket.join(`video-${videoId}`);
  });

  socket.on("leave-video", (videoId) => {
    socket.leave(`video-${videoId}`);
  });

  socket.on("new-comment", (data) => {
    socket.to(`video-${data.movieId}`).emit("comment-received", data);
  });
});

app.set("io", io);

const startServer = async () => {
  await connectDB();

  const PORT = config.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();