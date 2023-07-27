const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi')
const _ = require('lodash');
const { User } = require('../models/users');

const router = express.Router();



router.post('/', async (req, res) => {

    const { error } = validateAuth(req.body);
    if (error) return res.status(400).send(error.message);

    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('Bad data');

        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) return res.status(400).send('Invalid Email or Pass');

        const token = user.getAuthToken();

        // res.send(token);

        res.header('x-auth-tokken', token).send(_.pick(user, ['_id', 'name', 'email']));
    } catch (err) {
        res.status(500).send('Internal Server error');
    }

})

const validateAuth = (auth) => {
    const schema = Joi.object({
        email: Joi.string().max(255).required().min(3).trim().email(),
        password: Joi.string().max(255).required().trim(),
    });

    return schema.validate(auth);

}


module.exports = router;