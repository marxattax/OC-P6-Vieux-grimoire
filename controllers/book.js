const Book = require('../models/book')
const mongoose = require('mongoose');

exports.rateBook = (req, res, next) => {
    const newRating = {
      userId: req.body.userId, 
      grade : req.body.rating
    }

    Book.findOneAndUpdate(
      {_id:req.params.id},
      [
        {$set: 
          { ratings: { $concatArrays : ["$ratings", [ newRating ]] }}
        },
        {$set: 
          { averageRating: {$round: [{$avg : "$ratings.grade"}, 1]}}
        }
      ],
      {new: true, upsert: true, returnNewDocument: true}
    )
      .then(book => res.status(201).json(book))
      .catch(error => res.status(400).json({ error }));
}

exports.getBooks = (req, res, next) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
}

exports.getOneBook = (req, res, next) => {
  Book.findOne({_id: req.params.id})
  .then(book => res.status(200).json(book))
  .catch(error => res.status(400).json({ error }));
}

exports.createBook = (req, res, next) => {
    const bodyBook = JSON.parse(req.body.book);
    delete bodyBook.userId
    const book = new Book({
      userId: req.auth.userId,
      ...bodyBook,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.filename}`
    });
    book.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
}

exports.modifyBook = (req, res, next) => {
    delete req.body.userId
    const book = new Book({
      _id: req.params.id,
      userId: req.auth.userId,
      ...req.body,
    });

    if(req.file) {
      book.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.filename}`
    };
    
    Book.updateOne({_id: req.params.id}, book)
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
  }

exports.bestRating = (req, res, next) => {
    Book.find().sort({averageRating: -1}).limit(3)
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
}

exports.deleteBook = (req, res, next) => {
  Book.deleteOne({_id: req.params.id})
  .then(() => res.status(201).json({ message: 'Objet supprimé !'}))
  .catch(error => res.status(400).json({ error }));
}