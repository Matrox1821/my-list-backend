const express = require("express");
const app = express();
const cors = require("cors");
const server = require("http").createServer(app);
const WebSocket = require("ws");

const wss = new WebSocket.Server({ server: server });

wss.on("conection", function conection(ws) {
    console.log("A new client connected");
    ws.send("welcome new client");
    ws.on("message", function incoming(message) {
        console.log("received: %s", message);
        ws.send("Got ur message is: %s", message);
    });
});

app.use(cors());
app.use(express.json());

let notes = [
    { id: 1, content: "asdasdds", important: true },
    { id: 2, content: "asdasdddddddd", important: true },
    { id: 3, content: "aaaa", important: false },
];
/* const app = http.createServer((req, res) => {
    response.writeHead(200, { contentType: "application/json" });
    response.end(JSON.stringify(notes));
}); */
//GET
app.get("/", (req, res) => {
    res.status(200).send("<h1>Hello World</h1>");
});
app.get("/api/notes", (req, res) => {
    res.status(200).json(notes);
});
app.get("/api/notes/:id", (req, res) => {
    const id = Number(req.params.id);
    const note = notes.find((note) => note.id === id);
    if (note) {
        res.status(200).json(note);
    } else {
        res.status(404).end();
    }
});

//DELETE
app.delete("/api/notes/:id", (req, res) => {
    const id = Number(req.params.id);
    notes = notes.filter((note) => note.id !== id);
    res.status(204).end();
});

//POST
app.post("/api/notes", (req, res) => {
    const note = req.body;
    const ids = notes.map((note) => note.id);
    const maxId = Math.max(...ids);
    const newNotes = {
        id: maxId + 1,
        content: note.content,
        important:
            typeof note.important !== "undefined" ? note.important : false,
    };
    notes = [...notes, newNotes];
    res.json(newNotes);
});

//PORT
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
