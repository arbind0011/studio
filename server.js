
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const httpServer = createServer((req, res) => {
  const parsedUrl = parse(req.url, true);
  handle(req, res, parsedUrl);
});

const io = new Server(httpServer);

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

app.prepare().then(() => {
  httpServer.listen(3000, () => {
    console.log("> Ready on http://localhost:3000");
  });
});
