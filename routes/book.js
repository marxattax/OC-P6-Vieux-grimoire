const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth')
const multer = require('../middlewares/multerconfig')
const replaceImage = require('../middlewares/replaceImage')
const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.getBooks)
router.get('/bestrating', bookCtrl.bestRating)
router.get('/:id', bookCtrl.getOneBook)
router.post('/', auth,multer, replaceImage, bookCtrl.createBook)
router.post('/:id/rating', auth, bookCtrl.rateBook)
router.put('/:id', auth, multer, replaceImage, bookCtrl.modifyBook)
router.delete('/:id', auth, bookCtrl.deleteBook)

module.exports = router;