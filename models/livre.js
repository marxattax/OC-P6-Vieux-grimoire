const mongoose = require('mongoose');

const livreSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required:true },
  author: { type: String, required:true },
  genre: { type: String, required:true },
  year: { type: Number, required:true },
  imageUrl: { type: String, required:true },
  averageRating: { type: Number, required:true },
  ratings: [{
    userId: { type: String },
    grade: { type: Number }
}]
});

module.exports = mongoose.model('Livre', livreSchema);