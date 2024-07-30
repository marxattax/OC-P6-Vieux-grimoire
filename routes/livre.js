const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth')
const multer = require('../middlewares/multerconfig')
const avgrating = require('../middlewares/avgrating')
const livreCtrl = require('../controllers/livre')

router.post('/:id/rating', livreCtrl.rateBook)
router.get('/', livreCtrl.getBooks)
router.get('/bestrating', livreCtrl.bestRating)
router.get('/:id', livreCtrl.getOneBook)
router.post('/', auth, multer, livreCtrl.createBook)
router.put('/:id', auth, multer, livreCtrl.modifyBook)

module.exports = router;