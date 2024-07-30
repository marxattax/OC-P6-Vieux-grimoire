const { map } = require('../app');
const avgrating = require('../middlewares/avgrating');
const Livre = require('../models/livre')

exports.rateBook = (req, res, next) => {
    Livre.findOneAndUpdate(
      {_id: req.params.id}, 
      {$push: { 
        ratings: 
        {grade: req.body.rating,
        userId: req.body.userId}
      }}
    )
    .then(Livre.aggregate([
      {$project: {_id: "$_id", note: {$avg : "$ratings.grade" }}},
    ])

      .then(avgrating => {
        for(let i=0;i<avgrating.length;i++) {
          if(avgrating[i]._id == req.params.id) {
            Livre.findOneAndUpdate(
              {_id: req.params.id},
              {$set: { averageRating: Math.trunc(avgrating[i].note)}}
            )
            .then(res => console.log(res))
          }
        }
      })
    )
    .then(book => res.status(201).json(book))
    .catch(error => res.status(400).json({ error }));
}

exports.getBooks = (req, res, next) => {
    Livre.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
}

exports.getOneBook = (req, res, next) => {
    Livre.findOne({ _id: req.params.id })
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
}

exports.createBook = (req, res, next) => {
    const bodyLivre = JSON.parse(req.body.book);
    const livre = new Livre({
      ...bodyLivre,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
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
      imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
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