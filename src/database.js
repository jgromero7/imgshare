const mongoose = require('mongoose');
//    Destructuring
const { database } = require('./keys');

mongoose.connect(database.URI, {
    useNewUrlParser: true
})
    .then(db => console.log('----> DB is Connect'))
    .catch(err => console.error(err));