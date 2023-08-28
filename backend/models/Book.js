const mongoose = require("mongoose");
const booksSchema = mongoose.Schema({
  title: { type: String, require: true },
  author: { type: String, require: true },
  imageUrl: { type: String, require: true },
  year: { type: Number, require: true },
  genre: { type: String, require: true },
  ratings: [{ userId: { type: String, require: true } }, { grade: { type: Number, require: true } }],
  averageRating: { type: Number, require: true },
});

module.exports = mongoose.model("books", booksSchema);
