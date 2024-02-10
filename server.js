import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

// Declarations
const app = express();
const server = createServer(app);
const io = new Server(server);
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

let pseudo = "";
// Routes
app
  .route("/")
  .get((req, res) => {
    res.sendFile(join(__dirname, "./client/html/index.html"));
  })
  .post((req, res) => {
    console.log(req.body);
    pseudo = req.body.pseudo;
    res.cookie("name", pseudo).redirect("/partie");
  });

app.get("/partie", (req, res) => {
  res.sendFile(join(__dirname, "./client/html/partie.html"));
});

// Ecoute du port
server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});

// WebSocket
io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});
