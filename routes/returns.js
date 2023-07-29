const mongoose = require('mongoose');
const express = require('express');
const { Rental } = require('../models/rental');
const moment = require('moment');
const { Movie } = require('../models/movies');
const auth = require('../middlewares/auth');

const router = express.Router();



router.post('/', auth, async (req, res) => {
    if (!req.body.customerId) return res.status(400).send('customer ID  Not Found');
    if (!req.body.movieId) return res.status(400).send('movie Id  Not Found');

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


const dateDiff = (startDate, endDate) => {

    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    const timeDifferenceInMilliseconds = endDate - startDate;

    return Math.round(timeDifferenceInMilliseconds / oneDayInMilliseconds);
}


module.exports = router;