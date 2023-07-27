const express = require('express')
const mongoose = require('mongoose')

const auth = require('../middlewares/auth');
const { Genere, validate } = require('../models/genres');
const admin = require('../middlewares/admin');

const router = express.Router();


// get full list
router.get('/', async (req, res) => {
    try {
        const genres = await Genere.find();
        res.send(genres);
    }
    catch (err) {
        res.status(500).send(err);
    }
})

// get single genre
router.get('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).send('Invalid ID format');
        }
        const genre = await Genere.findById(req.params.id);
        if (!genre) return res.status(404).send('Not Found');
        res.send(genre);

    } catch (err) {
        res.status(500).send('Internal Server Error');
    }

})

// create a single genre
router.post('/', auth, async (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.message);

    let genre = new Genere({ name: req.body.name });
    genre = await genre.save();
    res.send(genre);
})

// update single genre
router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.message);

    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).send('Invalid ID format');
        }
        const genre = await Genere.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
        if (!genre) return res.status(404).send('Not Found');

        res.send(genre);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    };

})

// delete single genre
router.delete('/:id', [auth, admin], async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).send('Invalid ID format');
        }
        const genre = await Genere.findByIdAndRemove(req.params.id);
        if (!genre) return res.status(404).send('Not Found');
        res.send(genre);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }

})


module.exports = router;
