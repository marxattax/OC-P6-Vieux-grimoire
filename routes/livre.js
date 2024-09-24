const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth')
const multer = require('../middlewares/multerconfig')
const replaceImage = require('../middlewares/replaceImage')
const livreCtrl = require('../controllers/livre');

router.get('/', livreCtrl.getBooks)
router.get('/bestrating', livreCtrl.bestRating)
router.get('/:id', livreCtrl.getOneBook)
router.post('/', auth,multer, replaceImage, livreCtrl.createBook)
router.post('/:id/rating', auth, livreCtrl.rateBook)
router.put('/:id', auth, multer, replaceImage, livreCtrl.modifyBook)
router.delete('/:id', auth, livreCtrl.deleteBook)

module.exports = router;