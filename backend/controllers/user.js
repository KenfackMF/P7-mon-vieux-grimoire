const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// Gestion de l'inscription d'un utilisateur
exports.signup = (req, res, next) => {
  try {
    // Vérifiez si les données requises sont présentes
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ error: "Veuillez fournir une adresse e-mail et un mot de passe valide" });
    }

    // Vérifiez la validité de l'adresse e-mail (vous pouvez utiliser une validation plus approfondie ici)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).json({ error: "Adresse e-mail invalide" });
    }

    // Hash du mot de passe et création de l'utilisateur
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({ error: "Erreur de hachage du mot de passe" });
      }

      const user = new User({
        email: req.body.email,
        password: hash,
      });

      // Enregistrez l'utilisateur dans la base de données
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé avec succès" }))
        .catch((error) => res.status(500).json({ error }));
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Gestion de la connexion d'un utilisateur
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Adresse e-mail incorrecte" });
      }

      // Comparaison du mot de passe haché
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            res.status(401).json({ message: "Mot de passe incorrect" });
          } else {
            // Création d'un token JWT pour l'utilisateur
            res.status(200).json({
              userId: user._id,
              token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", { expiresIn: "24h" }),
            });
          }
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
