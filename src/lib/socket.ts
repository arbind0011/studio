
import { Server } from "socket.io";

const io = new Server();

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("sos", (data) => {
    console.log("SOS alert received:", data);
    // Broadcast the SOS alert to all connected clients (i.e., the security dashboard)
    io.emit("sos", data);
  });
});

export default io;
