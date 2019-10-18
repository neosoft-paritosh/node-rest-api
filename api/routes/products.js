const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const Product = require('../models/product');



router.get('/', (req, res, next) => {
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then( docs => {
        console.log(docs);
        const response = {
            count: docs.length,
            product: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    _id: doc._id,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/products/" + doc._id
                    }
                }
            })
        };
        // if (docs.length >= 0) {
            res.status(200).json(response);
        // } else {
        //     res.status(400).json({
        //         message: 'No entries found'
        //     })
        // }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    }); 
    product.save().then(result => {
        console.log(result);
        res.status(200).json({
            message : 'Product Added Successfully',
            createProduct : {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: "http://localhost:3000/products/" + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err 
        });
    });
    
}); 

router.get('/:productID', (req, res, next) => {
    const id = req.params.productID;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        // console.log(doc);
        if (doc) {
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    url: "http://localhost:3000/products/" 
                }
            });
        } else {
            res.status(404).json({message: "No data Found"});
        }        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.patch('/:productID', checkAuth, (req, res, next) => {
   const id = req.params.productID;
   const updateOps = {};
   for (const ops of req.body) {
       updateOps[ops.propName] = ops.value;
   }
   Product.update({ _id: id}, {$set: updateOps})
   .exec()
   .then(result => {
       console.log(result);
       res.status(200).json({
           message: 'Product Updated Successfully',
           request: {
               type: 'GET',
               url: "http://localhost:3000/products/" + id
           }
       });
   })
   .catch(err => {
       console.log(err);
       res.status(500).json({
           error: err
       });
   });
});

router.delete('/:productID', checkAuth, (req, res, next) => {
    const id = req.params.productID;
    Product.remove({_id : id })
    .exec()
    .then(results => {
        res.status(200).json({
            message: 'Product Deleted Successfully'
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});


module.exports = router;