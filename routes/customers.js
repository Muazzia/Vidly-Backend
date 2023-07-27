const express = require('express');
const mongoose = require('mongoose');
const { Customer, validateCustomer } = require('../models/customers');
const validateId = require('../utils/validateId');

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.send(customers);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
})

router.post('/', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.message);

    let customer = new Customer(
        {
            isGold: req.body.isGold,
            name: req.body.name,
            phone: req.body.phone
        }
    );

    try {
        customer = await customer.save();
        res.send(customer);

    } catch (err) {
        console.log(err);
        res.status(500).send('Internal server Error');
    }
})

router.get('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id))
            return res.status(400).send('Invalid ID format');

        const cusomter = await Customer.findById(req.params.id);
        if (!cusomter) return res.status(404).send('Not Found');

        res.send(cusomter);

    } catch (err) {
        res.status(500).send('Internal Server Error');
    }

})

router.put('/:id', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.message);

    try {
        if (!validateId(req.params.id)) return res.status(400).send('Invalid Id format');
        const customer = await Customer.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });
        if (!customer) return res.status(404).send('Not Found');
        res.send(customer);

    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
})

router.delete('/:id', async (req, res) => {
    if (!validateId(req.params.id)) return res.status(400).send('Invalid id format');

    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) return res.status(404).send('Not Found');

        res.send(customer);
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
})


module.exports = router;