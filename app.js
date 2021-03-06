const express = require('express');
const morgan = require('morgan');   
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const orderRoutes = require('./api/routes/orders');
const productRoutes = require('./api/routes/products');
const logoutRoutes = require('./api/routes/logout');
const userRoutes = require('./api/routes/users');

mongoose.connect("mongodb://localhost:27017/node-rest-api", { useNewUrlParser: true, useUnifiedTopology: true } ,(error) => {
    if(!error) {
        console.log('Success Connect');
    }else {
        console.log("Error connection to database");
    }
});

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((res, req, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);
app.use('/logout', logoutRoutes)


app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});


app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message : error.message
        }
    });
});

module.exports = app;