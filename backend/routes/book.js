const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const sharp = require("../middleware/sharp");
const multer = require("../middleware/multer-config");
const ctrlBook = require("../controllers/book");

router.get("/bestrating", ctrlBook.bestRating);
router.post("/", auth, multer, sharp, ctrlBook.createBook);
router.post("/:id/rating", auth, ctrlBook.postRating);
router.get("/", ctrlBook.getAllBooks);
router.get("/:id", ctrlBook.getOneBook);
router.put("/:id", auth, multer, sharp, ctrlBook.modifyBook);
router.delete("/:id", auth, ctrlBook.deleteBook);

module.exports = router;
