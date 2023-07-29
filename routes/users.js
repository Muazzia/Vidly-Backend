const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validateUser } = require('../models/users');
const auth = require('../middlewares/auth');


const router = express.Router();

router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.send(_.pick(user, ['name', 'email']))
    } catch (err) {
        res.status(500).send('Something went wrong try again');
    }
})

router.post('/', async (req, res) => {


    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.message);

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send('User already exists');

        user = new User(_.pick(req.body, ['name', 'email', 'password']));
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        user.password = hash
        await user.save();

        const token = user.getAuthToken();

        res.header('x-auth-tokken', token).send(_.pick(user, ['_id', 'name', 'email']));
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server error');
    }

})



module.exports = router;