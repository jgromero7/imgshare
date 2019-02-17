const path = require('path');
const exphbs = require('express-handlebars');

const express = require('express');
const errorHandler = require('errorhandler');
const morgan = require('morgan');
const multer = require('multer');

const routes = require('../routes/index');

module.exports = app => {

    // Settings
    app.set('port', process.env.PORT || 8080);
    app.set('views', path.join(__dirname, '../views'));
    app.engine('.hbs', exphbs({
        defaultLayout: 'main',
        layoutsDir: path.join(app.get('views'), 'layouts'),
        partialsDir: path.join(app.get('views'), 'partials'),
        extname: '.hbs',
        helpers: require('./helpers'),
    }));
    app.set('view engine', '.hbs');

    // middlerware
    app.use(morgan('dev'));
    app.use(multer({ dest: path.join(__dirname, '../public/upload/temp') }).single('image'));
    app.use(express.urlencoded({extended: false}));
    app.use(express.json());

    // Router
    routes(app);

    // static files
    app.use('/public', express.static(path.join(__dirname, '../public')));

    // ErrorHandler
    if ( 'development' === app.get('env') ) {
        app.use(errorHandler);
    }

    return app;
}   