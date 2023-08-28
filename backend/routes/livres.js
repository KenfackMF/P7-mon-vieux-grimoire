const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const livresCtrl = require("../controllers/livres");

router.post("/", livresCtrl.createBook);
router.put("/:id", livresCtrl.modifyBook);
router.delete("/:id", livresCtrl.deleteBook);
router.get("/:id", livresCtrl.getOneBook);
router.get("/", livresCtrl.getAllBooks);

module.exports = router;
