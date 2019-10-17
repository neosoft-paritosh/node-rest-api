const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message : 'Order GET called'
    });
});

router.post('/', (req, res, next) => {
    const order = {
        productId : req.body.productId,
        quantity : req.body.quantity
    };
    res.status(200).json({
        message : 'Oder POST called',
        order : order
    });
});

router.post('/:orderID', (req, res, next) => {
    res.status(200).json({
        message : 'GET by ID',
        id : req.params.orderID
    });
});

router.patch('/:orderID', (req, res, next) => {
    res.status(200).json({
        message : 'Updated Order'        
    });
});

router.delete('/:orderID', (req, res, next) => {
    res.status(200).json({
        message : 'Order Deleted'
    });
});

module.exports = router;