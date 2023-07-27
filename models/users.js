const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema({
    name: { type: String, trim: true, required: true, minlength: 3, maxlength: 255 },
    email: { type: String, time: true, required: true, maxlength: 255, unique: true },
    password: { type: String, trim: true, required: true, maxlength: 255 },
    isAdmin: { type: Boolean, default: false },
})

schema.methods.getAuthToken = function () {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, process.env.jwtPrivateKey);
}

const User = mongoose.model('User', schema);


const validateUser = (user) => {
    const schema = Joi.object({
        name: Joi.string().max(255).required().min(3).trim(),
        email: Joi.string().max(255).required().min(3).trim().email(),
        password: Joi.string().max(255).required().trim(),
    })

    return schema.validate(user);
}


module.exports.User = User;
module.exports.validateUser = validateUser; 