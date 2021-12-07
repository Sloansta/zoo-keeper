const express = require('express');
const fs = require('fs');
const path = require('path');
const { allowedNodeEnvironmentFlags } = require('process');
const PORT = process.env.PORT || 80;
const app = express();
// parse incoming string or array data
app.use(express.urlencoded({extended: true}));
// parse incoming JSON data
app.use(express.json());
const { animals } = require('./data/animals');

function filterByQuery(query, animalArray) {
    let personalityTraitsArr = [];
    let filteredResults = animalArray;

    if(query.personalityTraits) {
        if(typeof query.personalityTraits === 'string')
            personalityTraitsArr = [query.personalityTraits];
        else 
            personalityTraitsArr = query.personalityTraits;

        personalityTraitsArr.forEach(trait => {
            filteredResults = filteredResults.filter(animal => animal.personalityTraits.indexOf(trait) !== -1);
        });
    }

    if(query.diet)
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    if(query.species)
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    if(query.name)
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    return filteredResults;
}

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

function createNewAnimal(body, animalsArray) {
    console.log(body);
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(path.join(__dirname, './data/animals.json'),
    JSON.stringify({animals: animalsArray}, null, 2)
    );

    return body;
}

function validateAnimal(animal) {
    if(!animal.name || typeof animal.name !== 'string')
        return false;
    if(!animal.species || typeof animal.species !== 'string')
        return false;
    if(!animal.diet || typeof animal.diet !== 'string')
        return false;
    if(!animal.personalityTraits || !Array.isArray(animal.personalityTraits))
        return false;
    return true;
}

app.get('/api/animals', (req, res) => {
    let results = animals;
    if(req.query)
        results = filterByQuery(req.query, results);
        
    console.log(req.query);
    res.json(results);
});

app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if(result)
        res.json(result);
    else 
        res.sendStatus(404);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.post('/api/animals', (req, res) => {
    // req.body is where our incoming content will be 
    req.body.id = animals.length.toString();

    if(!validateAnimal(req.body))
        res.status(400).send('The animal is not properly formatted.');
    else {
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }
});

app.listen(PORT, () => {
    console.log(`API server now on ${PORT}`);
});