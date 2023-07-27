const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genres');

const schema = new mongoose.Schema({
    title: { type: String, required: true, minLength: 3, maxLength: 255 },
    numberInStock: { type: Number, default: 0, min: 0, max: 255 },
    dailyRentalRate: { type: Number, default: 0, min: 0, max: 255 },
    genre: { type: genreSchema, required: true }

})


const Movie = mongoose.model('Movie', schema);


const validateMovie = (movie) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(255).required(),
        numberInStock: Joi.number().min(0).max(255),
        dailyRentalRate: Joi.number().min(0).max(255),
        genre: Joi.string().min(3).max(255).required()
    })

    return schema.validate(movie);
}

exports.Movie = Movie;
exports.validateMovie = validateMovie;