const express = require('express');
const { Genere } = require('../models/genres');
const { Movie, validateMovie } = require('../models/movies');
const validateId = require('../utils/validateId');



const router = express.Router();



router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.send(movies)
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
})

router.get('/:id', async (req, res) => {
    if (!validateId(req.params.id)) return res.status(400).send('Invalid Id format');
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).send('Not Found');
        res.send(movie);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
})

router.delete('/:id', async (req, res) => {
    if (!validateId(req.params.id)) return res.status(400).send('Invalid id format');
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) return res.status(404).send('Not Found');

        res.send(movie);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
})

router.put('/:id', async (req, res) => {
    if (!validateId(req.params.id)) return res.status(400).send('Invalid id format');

    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.message);

    try {
        if (!validateId(req.body.genre)) return res.status(400).send('genre Invalid id format');
        const genre = await Genere.findById(req.body.genre);
        if (!genre) return res.status(404).send('Not Found Genre');

        const movie = await Movie.findByIdAndUpdate(req.params.id, { ...req.body, genre }, { new: true });
        if (!movie) return res.status(404).send('Not Found');

        res.send(movie);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
})

router.post('/', async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.message);

    if (!validateId(req.body.genre)) return res.status(400).send('Invalid genre id format')

    try {
        const genre = await Genere.findById(req.body.genre);
        if (!genre) return res.status(404).send('Not Found Genre');
        let movie = new Movie({
            title: req.body.title,
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate,
            genre: { _id: genre._id, name: genre.name }
        })

        movie = await movie.save();
        res.send(movie)
    } catch (err) {
        res.status(500).send('INternal server error');
    }
})









module.exports = router;