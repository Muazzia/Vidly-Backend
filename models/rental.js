const mongoose = require('mongoose');


const schema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: { type: String, required: true, trim: true, minLength: 3, maxLength: 255 },
            phone: { type: String, required: true, minLength: 3, maxLength: 255 },
            isGold: { type: Boolean, default: false }
        }),
        required: true,
    },
    movie: {
        type: new mongoose.Schema({
            title: { type: String, required: true, trim: true, minLength: 3, maxLength: 255 },
            dailyRentalRate: { type: Number, default: 0, min: 0, max: 255 },
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0,
    }

});

const Rental = mongoose.model('Rental', schema);
module.exports.Rental = Rental;