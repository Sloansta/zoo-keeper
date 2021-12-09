const express = require('express');
const fs = require('fs');
const path = require('path');
const { allowedNodeEnvironmentFlags } = require('process');
const PORT = process.env.PORT || 80;
const app = express();
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');
// parse incoming string or array data
app.use(express.urlencoded({extended: true}));
// parse incoming JSON data
app.use(express.json());

app.use(express.static('public'));
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

//const { animals } = require('./data/animals');


app.listen(PORT, () => {
    console.log(`API server now on ${PORT}`);
});