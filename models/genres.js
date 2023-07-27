const mongoose = require('mongoose')
const Joi = require('joi')

const schema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 255 },
})

const Genere = mongoose.model('Genre', schema);

const validateGenre = (genre) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required().max(255).trim()
    })

    return schema.validate(genre);
}


exports.Genere = Genere;
exports.validate = validateGenre;
exports.genreSchema = schema;
