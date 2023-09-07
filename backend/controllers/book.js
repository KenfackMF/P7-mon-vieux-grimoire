const Book = require("../models/book");
const axios = require("axios");

exports.createBook = (req, res, next) => {
  const bookStringified = req.body.book;
  const book = JSON.parse(bookStringified);
  const file = req.file;
  try {
    const newBook = new Book({
      userId: book.userId,
      title: book.title,
      author: book.author,
      imageUrl: file.filename,
      year: book.year,
      genre: book.genre,
      ratings: [
        {
          userId: book.userId,
          grade: book.ratings.find((obj) => obj.userId === book.userId).grade,
        },
      ],
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,

      averageRating: 0,
    });
    newBook.save();
    res.send(newBook);
  } catch (error) {
    console.error(error);
  }
};

exports.getOneBook = (req, res, next) => {
  const id = req.params.id;
  const book = Book.findById(id);
  book.imageUrl = generateImageUrl(book.imageUrl);
  res.send(book);
};

exports.modifyBook = (req, res, next) => {
  const book = new Book({
    _id: req.params.id,
    title: req.body.title,
    author: req.body.author,
    imageUrl: req.body.imageUrl,
    year: req.body.year,
    genre: req.body.genre,
    rating: req.body.rating,
    userId: req.body.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });
  Book.updateOne({ _id: req.params.id }, book)
    .then(() => {
      res.status(201).json({
        message: "Book updated successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.deleteBook = async (req, res, next) => {
  try {
    const id = req.params.id;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).send("Book not found");
    }

    const userIdOnBook = book.userId;

    if (userIdOnBook !== req.body.userIdFromToken) {
      return res.status(401).send("You can only delete your own books");
    }

    const result = await Book.findByIdAndDelete(id);

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
