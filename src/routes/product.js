const express = require('express');
var multer  = require('multer');
const path = require('path');
const router = express.Router();

const productController = require('../app/controllers/ProductController')
//upload file
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, '../public/uploads/'))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
    })
    var upload = multer({ storage: storage,
        fileFilter: function (req, file, cb) {
            var filetypes = /jpeg|jpg|png/;
            var mimetype = filetypes.test(file.mimetype);
            var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
            if (mimetype && extname) {
                return cb(null, true);
            }
            cb("Error: File upload only supports the following filetypes - " + filetypes);
            }                
    })
//
router.get('/create',productController.index)//get
router.post('/create',upload.single('image'),productController.create)//post
router.get('/statistic',productController.store)//get statistic
router.get('/edit/:id',productController.getEdit)//get edit
router.post('/edit/:id',upload.single('image'),productController.postEdit)//post edit
router.post('/delete/:id',productController.postDelete)//post delete
router.get('/delete/trash',productController.getDeletetrash)//post delete
router.post('/delete/trash/:id',productController.postDeletetrash)//post delete
router.get('/restore/trash/:id',productController.restoreTrash)//post delete
//detail Product
router.get('/detailProcduct/:idProduct',productController.detailProcduct)
//cart 
router.get('/cart/:idProduct',productController.addCart)





module.exports = router;