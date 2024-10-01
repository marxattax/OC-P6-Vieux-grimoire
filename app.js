const express = require('express');
const app = express()
const path = require('path');
require('dotenv').config()

const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://${process.env.MONGODB}:${process.env.MONGOPWD}@critique.drokdtc.mongodb.net/grimoire?retryWrites=true&w=majority&appName=Critique`)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/book');
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);

module.exports = app;