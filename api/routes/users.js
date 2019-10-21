const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

// TO send EMAIL for Multiple people 

    // let mailOption = {
    //     from: 'paritoshpuranik17@gmail.com',
    //     to: 'ganesh@gmail.com, paritoshpuranik@gmail.com',
    //     subject: 'Successful Login',
    //     text: 'Welcome ' +req.body.email
    // }
// TO send EMail for Multiple use ends

// TO add CC in mail Start
    // let mailOption = {
    //     from: 'paritoshpuranik17@gmail.com',
    //     to: 'ganesh@gmail.com, paritoshpuranik@gmail.com',
    //     cc: 'email@gmail.com'
    //     subject: 'Successful Login',
    //     text: 'Welcome ' +req.body.email
    // }

// To add cc in mail ends


router.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email })
    .exec()
    .then(user => {
        if(user.length >= 1) {
            return res.status(409).json({
                message: 'Mail exists'
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user.save()
                    .then(result => {
                        console.log(result);
                        let mailOption = {
                            from: 'paritoshpuranik17@gmail.com',
                            to: req.body.email,
                            subject: 'Successful Login',
                            text: 'Welcome ' +req.body.email
                        }
                        transporter.sendMail(mailOption, function(err, data) {
                            if(err) {
                                console.log('Error' +err);
                            } else {
                                console.log('Email Sent !!!');
                            }
                        })
                        res.status(201).json({
                            message: 'User Created'
                        })
                        
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        })
                    }); 
                }    
            });
        }
    })    
});

router.post('/login', (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if(user < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if(err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                } 
                if(result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, process.env.JWT_KEY, 
                        {
                            expiresIn: "1h"
                        }                    
                    );
                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    });
                }
                res.status(401).json({
                    message: 'Auth failed'
                });
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.delete("/:userID", (req, res, next) => {
    User.remove({ _id: req.params.userID })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User Deleted'
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;