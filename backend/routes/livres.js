const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const livresCtrl = require("../controllers/livres");
const multer = require("../middleware/multer-config");

router.post("/", auth, livresCtrl.createBook);
router.put("/:id", auth, livresCtrl.modifyBook);
router.delete("/:id", auth, livresCtrl.deleteBook);
router.get("/:id", auth, livresCtrl.getOneBook);
router.get("/", auth, livresCtrl.getAllBooks);

module.exports = router;
