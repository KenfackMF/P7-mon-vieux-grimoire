const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();

const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");

app.use(express.json());

// Configuration des en-têtes CORS pour permettre les requêtes depuis n'importe quelle origine
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

// Connexion à la base de données MongoDB
mongoose
  .connect("mongodb+srv://kenfack:Nathan19@cluster0.7fvc0ni.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.error("Erreur de connexion à MongoDB :", error));

// Utilisation des routes pour les livres et les utilisateurs
app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
