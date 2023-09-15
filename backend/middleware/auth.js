const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ error: "Authorization header missing" });
    }
    console.log("autorisation refusée");

    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;

    req.userId = userId;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Authentication failed" });
  }
};
