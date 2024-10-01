const sharp = require('sharp');
const fs = require('fs')
const Book = require('../models/book')

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
  };

module.exports = (req, res, next) => {
  if(req.file) {
    /* Si id envoyé dans la requête (donc update et pas création), suppression de l'ancienne image */
    if(req.params.id) {
      Book.findOne({_id: req.params.id})
      .then(book => {
          const oldImage = book.imageUrl.split(`${req.protocol}://${req.get('host')}/`)[1]
          fs.unlink(oldImage, (err => {
            if (err) console.log(err);
            else { console.log("\nDeleted file:" + oldImage); }
          }))
      })
    }

    /* réécriture du nom de l'image */
    const extension = MIME_TYPES[req.file.mimetype];
    const name = req.file.originalname.split(' ').join('_').split('.' + extension).join('_').split("'").join('_');
    req.filename = name + Date.now() + '.webp';

    /* Reformatage de l'image au format webp */
    sharp(req.file.buffer)
      .toFormat('webp')
      .toFile(`./images/${req.filename}`)
      next();
  }

  else {
    next();
  }
}