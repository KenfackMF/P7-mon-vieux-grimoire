const multer = require("multer");

// Types MIME autorisés et leurs extensions correspondantes
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Configuration de l'espace de stockage pour les fichiers téléchargés
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images"); // Le répertoire "images" est utilisé pour stocker les fichiers téléchargés
  },
  filename: (req, file, callback) => {
    // Nettoyez le nom du fichier d'origine en supprimant les espaces et générez un nom unique
    const name = file.originalname.replace(/\s+/g, "-"); // Remplace les espaces par des tirets
    const extension = MIME_TYPES[file.mimetype];
    const uniqueFileName = name + "-" + Date.now() + "." + extension;
    callback(null, uniqueFileName);
  },
});

// Exportez le middleware Multer configuré pour gérer un seul fichier "image"
module.exports = multer({ storage }).single("image");
