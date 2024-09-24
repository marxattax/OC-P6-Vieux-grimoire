const Livre = require('../models/livre')
const mongoose = require('mongoose');

exports.rateBook = (req, res, next) => {
    const newRating = {
      userId: req.body.userId, 
      grade : req.body.rating
    }

    Livre.findOneAndUpdate(
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
    Livre.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
}

exports.getOneBook = (req, res, next) => {
  Livre.findOne({_id: req.params.id})
  .then(book => res.status(200).json(book))
  .catch(error => res.status(400).json({ error }));
}

exports.createBook = (req, res, next) => {
    const bodyLivre = JSON.parse(req.body.book);
    const livre = new Livre({
      ...bodyLivre,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.filename}`
    });
    livre.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
}

exports.modifyBook = (req, res, next) => {
  if(req.file) {
    const livre = new Livre({
      _id: req.params.id,
      ...req.body.book,
      imageUrl : `${req.protocol}://${req.get('host')}/images/${req.filename}`
    });
    Livre.updateOne({_id: req.params.id}, livre)
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
  }
  else {
    const livre = new Livre({
        _id: req.params.id,
        ...req.body,
      });
      Livre.updateOne({_id: req.params.id}, livre)
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  }
}

exports.bestRating = (req, res, next) => {
    Livre.find().sort({averageRating: -1}).limit(3)
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
}

exports.deleteBook = (req, res, next) => {
  Livre.deleteOne({_id: req.params.id})
  .then(() => res.status(201).json({ message: 'Objet supprimé !'}))
  .catch(error => res.status(400).json({ error }));
}