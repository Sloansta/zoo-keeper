const express = require('express');
const app = express();
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

app.get('/api/animals', (req, res) => {
    let results = animals;
    if(req.query)
        results = filterByQuery(req.query, results);
        
    console.log(req.query);
    res.json(results);
});

app.listen(3001, () => {
    console.log('API server now on port 3001');
});