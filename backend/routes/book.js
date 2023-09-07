const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const ctrlBook = require("../controllers/book");

router.post("/", auth, multer, ctrlBook.createBook);
router.put("/:id", auth, ctrlBook.modifyBook);
router.delete("/:id", auth, ctrlBook.deleteBook);
router.get("/", auth, multer, ctrlBook.getAllBooks);
router.get("/:id", auth, multer, ctrlBook.getOneBook);

module.exports = router;
