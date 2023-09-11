exports.postRating = async (req, res, next) => {
  const id = req.params.id;
  const book = await book.findById(id);
  const userId = req.body.userIdFromToken;
  try {
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
    const averageRating = sum / numberOfRaters;
    book.ratings = ratings;
    book.averageRating = averageRating;

    book.save();
    res.send(book);
  } catch (error) {
    console.error(error);
  }
};

exports.bestRating = async function (req, res, next) {
  const books = await books.find().sort({ averageRating: -1 }).limit(3);
  res.send(books);
};
