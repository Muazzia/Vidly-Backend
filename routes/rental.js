const express = require('express');
const Joi = require('joi');
const validateId = require('../utils/validateId');
const { Customer } = require('../models/customers');
const { Movie } = require('../models/movies');
const { Rental } = require('../models/rental');


const router = express.Router();



router.get('/', async (req, res) => {
    try {
        const rentals = await Rental.find();
        res.send(rentals);

    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

router.get('/:id', async (req, res) => {
    if (!validateId(req.params.id)) return res.status(400).send('Id format invalid');
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.message);

    try {
        const rental = await Rental.findById(req.params.id);
        if (!rental) return res.status(404).snd("Not Found");
        res.send(rental);
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }


})

router.delete('/:id', async (req, res) => {
    if (!validateId(req.params.id)) return res.status(400).send('Invalid id format');
    try {
        const rental = await Rental.findByIdAndDelete(req.params.id);
        if (!rental) return res.status(404).send('Not Found');

        res.send(rental);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
})

router.put('/:id', async (req, res) => {
    if (!validateId(req.params.id)) return res.status(400).send('Invalid id format');

    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.message);

    try {
        if (!validateId(req.body.customerId)) return res.status(400).send('customer Invalid id format');

        if (!validateId(req.body.movieId)) return res.status(400).send('movie Invalid id format');

        const customer = await Customer.findById(req.body.customerId);
        if (!customer) return res.status(404).send('Not Found customer');

        const movie = await Movie.findById(req.body.movieId);
        if (!movie) return res.status(404).send('Not Found Movie');

        const rental = await Rental.findByIdAndUpdate(req.params.id, { customer, movie }, { new: true });
        if (!rental) return res.status(404).send('Not Found');

        res.send(rental);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
})

router.post('/', async (req, res) => {
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.message);



    if (!validateId(req.body.customerId)) return res.status(400).send('Invalid customer id format');
    if (!validateId(req.body.movieId)) return res.status(400).send('Invalid movie id format');

    try {
        const customer = await Customer.findById(req.body.customerId);
        if (!customer) return res.status(404).send('Not Found Customer');

        const movie = await Movie.findById(req.body.movieId);
        if (!movie) return res.status(404).send('Not Found Movie');

        if (movie.numberInStock === 0) return res.status(500).send('No Movie in Stock');

        const rental = new Rental({
            customer: {
                _id: customer._id,
                name: customer.name,
                phone: customer.phone,
            },
            movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate,
            },
        });

        const response = await rental.save();
        movie.numberInStock--;
        await movie.save();

        res.send(response);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal server error');
    }
});

function validateRental(rental) {
    const schema = Joi.object({
        customerId: Joi.string().required(),
        movieId: Joi.string().required(),
    })

    return schema.validate(rental);
}

module.exports = router;