const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const livresRoutes = require("./routes/livres");
const userRoutes = require("./routes/user");
const bodyParser = require("body-parser");

mongoose.connect(
  "mongodb+srv://kenfack:Nathan19@cluster0.7fvc0ni.mongodb.net/?retryWrites=true&w=majority,",

  {
    useNewUrlParser: true,

    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;

db.on("error", (error) => {
  console.error("Erreur de connexion :", error);
});

db.once("open", () => {
  console.log("Connecté à MongoDB Atlas !");
});

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});
app.use(bodyParser.json());
app.use("/api/livres", livresRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
