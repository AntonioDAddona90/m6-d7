const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const PORT = 5050;

require("dotenv").config();

// require delle Routes
const postsRoute = require("./routes/posts/posts");
const authorsRoute = require("./routes/authors/authors");
const resourcesRoute = require("./routes/resources/resources");
const commentsRoute = require("./routes/comments/comments");
const loginRoute = require("./routes/login/login");
const githubRoute = require("./routes/github/githubRoute");

const logger = require("./middlewares/logger");

const app = express();

app.use("/uploads", express.static("uploads"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//enable CORS
app.use(cors());

// middleware
app.use(express.json());
app.use(logger);

// import delle Routes
app.use("/", postsRoute);
app.use("/", authorsRoute);
app.use("/", resourcesRoute);
app.use("/", commentsRoute);
app.use("/", loginRoute);
app.use("/", githubRoute);

mongoose.connect(process.env.MONGO_DB_URL);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Errore di connessione al server"));

db.once("open", () => {
  console.log("Databases MongoDB connected!");
});

//questa sarà l'ultima riga del server.js
app.listen(PORT, () => console.log(`server started and listening on port: ${PORT}`));