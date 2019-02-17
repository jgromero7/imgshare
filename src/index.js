const express = require('express');

// Config Server
const config = require('./server/config');

// DataBase
require('./database');

const app = config(express());

// Starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});