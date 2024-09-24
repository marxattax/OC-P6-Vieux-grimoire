const sharp = require('sharp');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
  };

module.exports = (req, res, next) => {
      const extension = MIME_TYPES[req.file.mimetype];
      const name = req.file.originalname.split(' ').join('_').split('.' + extension).join('_');
      req.filename = name + Date.now() + '.webp';

    sharp(req.file.buffer)
      .toFormat('webp')
      .toFile(`./images/${req.filename}`)
      next();
}