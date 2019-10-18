const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const checkAuth  = require('../middleware/check-auth');
const Order = require('../models/order');
const Product =  require('../models/product');

router.get('/', checkAuth, (req, res, next) => {
    Order
    .find()
    .select('_id product quantity')
    .populate('product', 'name price')
    .exec()
    .then(docs => {
        console.log(docs);        
        res.status(200).json({            
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + doc._id
                    }
                }
            })            
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
});

router.post('/',checkAuth, (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if(!product) {
                return res.status(404).json({
                    message: 'Product Not Found'
                });
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save()            
        })
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Order Added Successfully',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: "GET",
                    url: 'http://localhost:3000/orders/' + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
    
    // res.status(200).json({
    //     message : 'Oder POST called',
    //     order : order
    // });
});

router.get('/:orderID',checkAuth, (req, res, next) => {
   Order.findById(req.params.orderID)
   .populate('product')
    .exec()
    .then(doc => {
        if(!doc) {
            return res.status(404).json({
                message: 'Order Not Found'
            })
        }
        res.status(200).json({
            order: doc,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders/'
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

// router.patch('/:orderID', (req, res, next) => {
//     res.status(200).json({
//         message : 'Updated Order'        
//     });
// });

router.delete('/:orderID', checkAuth, (req, res, next) => {
    Order.remove({ _id: req.params.orderID })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Order Deleted Successfully',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders',
                body: { productId: 'ID', quantity: 'number' }
            }
        })
    })
    .catch();
});

module.exports = router;