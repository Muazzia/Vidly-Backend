const mongoose = require('mongoose');
const express = require('express');
const { Rental } = require('../models/rental');
const moment = require('moment');
const { Movie } = require('../models/movies');
const auth = require('../middlewares/auth');
const Joi = require('joi');

const router = express.Router();



router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.message);

    const rental = await Rental.findOne({
        'customer._id': req.body.customerId,
        'movie._id': req.body.movieId,
    });

    if (!rental) return res.status(400).send("Rental Not Found");
    if (rental.dateReturned) return res.status(400).send('Date out is already processed');
    rental.dateReturned = new Date();

    const daysDifference = dateDiff(rental.dateOut, rental.dateReturned);

    rental.rentalFee = daysDifference * rental.movie.dailyRentalRate;
    await Movie.findByIdAndUpdate(req.body.movieId, {
        $inc: { numberInStock: 1 }
    });

    await rental.save();
    res.send(rental);

})

const validate = (r) => {
    const objectId = Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }, 'Object ID Validation');

    const schema = Joi.object({
        customerId: objectId.required().min(3).max(255),
        movieId: objectId.required().min(3).max(255)
    })

    return schema.validate(r);
}


const dateDiff = (startDate, endDate) => {

    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    const timeDifferenceInMilliseconds = endDate - startDate;

    return Math.round(timeDifferenceInMilliseconds / oneDayInMilliseconds);
}


module.exports = router;