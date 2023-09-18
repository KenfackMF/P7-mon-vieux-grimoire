const Book = require("../models/book");
const fs = require("fs");
const prefix = "processed_";

exports.createBook = (req, res, next) => {
  const bookStringified = req.body.book;
  const book = JSON.parse(bookStringified);

  if (!book.ratings) {
    book.ratings = [];
  }

  try {
    const newBook = new Book({
      userId: book.userId,
      title: book.title,
      author: book.author,
      year: book.year,
      genre: book.genre,
      ratings: book.ratings,
      imageUrl: `${req.protocol}://${req.get("host")}/images//${prefix}${req.file.filename}`,
      averageRating: book.averageRating,
    });

    newBook.save();
    res.send(newBook);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyBook = async (req, res, next) => {
  const id = req.params.id;
  const book = await Book.findById(id);
  if (!book) return res.status(404).send("Book not found");

  const userId = book.userId;
  if (userId !== req.userId) return res.status(401).send("You can only update your own books");

  if (req.file) {
    const newImageUrl = `${req.protocol}://${req.get("host")}/images//${prefix}${req.file.filename}`;

    const oldImageUrl = book.imageUrl;
    if (oldImageUrl && fs.existsSync(oldImageUrl)) {
      fs.unlinkSync(oldImageUrl);
    }

    book.imageUrl = newImageUrl;
  }

  if (req.body.title) book.title = req.body.title;
  if (req.body.author) book.author = req.body.author;
  if (req.body.year) book.year = req.body.year;
  if (req.body.genre) book.genre = req.body.genre;

  const result = await book.save();

  res.send(result);
};

exports.deleteBook = async (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images//${prefix}${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.postRating = async (req, res, next) => {
  console.log("userId:", req.userId);
  const rateObject = {
    userId: `${req.body.userId}`,
    grade: req.body.rating,
  };

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      const mapRateId = book.ratings.map((rate) => rate.userId);
      if (mapRateId.includes(req.userId)) {
        res.status(401).json({ message: "Action non autorisée, note déjà attribuée" });
      } else {
        const newAverage = (book.averageRating * book.ratings.length + rateObject.grade) / (book.ratings.length + 1);

        Book.updateOne({ _id: req.params.id }, { $push: { ratings: rateObject }, $set: { averageRating: newAverage } })
          .then(() => res.status(200).json(book))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.bestRating = async function (req, res, next) {
  try {
    const books = await Book.find().sort({ averageRating: -1 }).limit(3);
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};
