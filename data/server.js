const express = require('express');
const app = express();
const { animals } = require('./data/animals');

app.get('/', (req, res) => {
    res.send('Hello!');
});

app.listen(3000, () => {
    console.log('API server now on port 3000');
});