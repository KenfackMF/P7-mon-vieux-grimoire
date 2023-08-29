const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const livresCtrl = require("../controllers/livres");

router.post("/", auth, multer, livresCtrl.createBook);
router.put("/:id", auth, multer, livresCtrl.modifyBook);
router.delete("/:id", auth, livresCtrl.deleteBook);
router.get("/:id", auth, livresCtrl.getOneBook);
router.get("/", auth, livresCtrl.getAllBooks);

module.exports = router;
