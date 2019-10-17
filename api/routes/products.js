const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find()
    .exec()
    .then( docs => {
        console.log(docs);
        // if (docs.length >= 0) {
            res.status(200).json(docs);
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

router.post('/', (req, res, next) => {
    // const product = {
    //     name : req.body.name,
    //     price: req.body.price
    // };

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    }); 
    product.save().then(result => {
        console.log(result);
        res.status(200).json({
            message : 'Handling POST request to /product',
            createProduct : product
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
    .exec()
    .then(doc => {
        // console.log(doc);
        if (doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({message: "No data Found"});
        }        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.patch('/:productID', (req, res, next) => {
   res.status(200).json({
       message : 'Updated product'
   });
});

router.delete('/:productID', (req, res, next) => {
    const id = req.params.productID;
    Product.remove({_id : id })
    .exec()
    .then(results => {
        res.status(200).json(results);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});


module.exports = router;