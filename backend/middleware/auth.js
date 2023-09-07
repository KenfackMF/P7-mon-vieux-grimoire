const jwt = require("jsonwebtoken");

// Middleware d'authentification basé sur les tokens JWT
module.exports = (req, res, next) => {
  try {
    // Vérifie si l'en-tête d'autorisation est présent dans la requête
    if (!req.headers.authorization) {
      throw new Error("Authorization header missing");
    }

    // Extrait le token JWT de l'en-tête d'autorisation
    const token = req.headers.authorization.split(" ")[1];

    // Vérifie et décode le token JWT en utilisant la clé secrète (à remplacer par votre vraie clé)
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");

    // Extrait l'ID de l'utilisateur à partir du token JWT et le stocke dans req.auth.userId
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };

    // Passe la requête à la prochaine étape du middleware
    next();
  } catch (error) {
    // Gère les erreurs d'authentification en renvoyant une réponse d'erreur JSON
    res.status(401).json({ error: "Authentication failed" });
  }
};
