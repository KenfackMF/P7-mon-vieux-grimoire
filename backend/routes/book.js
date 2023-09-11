const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const ctrlBook = require("../controllers/book");

router.post("/", auth, multer, ctrlBook.createBook);
router.post("/:id/rating", auth, ctrlBook.postRating);
router.put("/:id", auth, multer, ctrlBook.modifyBook);
router.delete("/:id", auth, ctrlBook.deleteBook);
router.get("/", ctrlBook.getAllBooks);
router.get("/:id", ctrlBook.getOneBook);
router.get("/bestrating", auth, ctrlBook.bestRating);

module.exports = router;
