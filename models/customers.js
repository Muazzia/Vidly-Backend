const mongoose = require('mongoose');
const Joi = require("joi");

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: { type: String, required: true, minLength: 3 },
    phone: { type: String, required: true, minLength: 3 },
    isGold: { type: Boolean, required: true }
}));


const validateId = (id) => {
    return mongoose.Types.ObjectId.isValid(id)
}

const validateCustomer = (customer) => {
    const schema = Joi.object({
        isGold: Joi.boolean().required(),
        name: Joi.string().min(3).required(),
        phone: Joi.string().min(3).required(),
    });

    return schema.validate(customer);
}


exports.Customer = Customer;
exports.validateId = validateId;
exports.validateCustomer = validateCustomer;
