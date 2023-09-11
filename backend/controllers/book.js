const Book = require("../models/book");
const fs = require("fs");

exports.createBook = (req, res, next) => {
  const bookStringified = req.body.book;
  const book = JSON.parse(bookStringified);
  const file = req.file;

  if (!book.ratings) {
    book.ratings = [];
  }

  try {
    const newBook = new Book({
      userId: book.userId,
      title: book.title,
      author: book.author,
      imageUrl: file.filename,
      year: book.year,
      genre: book.genre,
      ratings: book.ratings,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      averageRating: 0,
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

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
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
  const id = req.params.id;
  try {
    const book = await Book.findById(id);
    const userId = req.body.userId;
    const ratings = book.ratings;

    if (ratings.some((obj) => obj.userId === userId)) {
      return res.status(400).send("You have already rated this book");
    }

    const newRating = {
      userId: userId,
      grade: req.body.rating,
    };
    ratings.push(newRating);

    const sum = ratings.reduce((total, curr) => (total += curr.grade), 0);
    const numberOfRaters = ratings.length;
    const averageRating = sum / numberOfRaters || 0; // Assurez-vous qu'averageRating est défini même si numberOfRaters est de zéro.
    book.ratings = ratings;
    book.averageRating = averageRating;

    console.log("Nouvelle averageRating calculée : " + averageRating);

    await book.save();
    res.send(book);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.bestRating = async function (req, res, next) {
  try {
    console.log("Route /bestrating atteinte."); // Ajoutez ce journal pour vérifier si la route est atteinte.

    const books = await Book.find().sort({ averageRating: -1 }).limit(3);
    res.send(books);
  } catch (error) {
    console.error("Erreur dans la route /bestrating :", error); // Ajoutez ce journal pour afficher les erreurs, le cas échéant.

    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
