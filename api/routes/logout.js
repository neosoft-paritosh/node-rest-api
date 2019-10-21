const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Logout = require('../models/logout');

const checkAuth = require('../middleware/check-auth');

router.post('/', checkAuth, (req, res, next) => {
    const logout = new Logout({
        _id: new mongoose.Types.ObjectId(),
        token: req.body.token
    });
    console.log(logout);
    logout.save().then(result => {
        console.log(result);
        res.status(200).json({
            message : 'Logout Successfully',
            data : {
                _id: result._id,
                token: result.token               
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

module.exports = router;