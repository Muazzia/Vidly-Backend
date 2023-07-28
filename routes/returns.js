const mongoose = require('mongoose');
const express = require('express');

const router = express.Router();


router.post('/', (req, res) => {
    if (!req.body.customerId) return res.status(400).send('Not Found');
    if (!req.body.movieId) return res.status(400).send('Not Found');

    return res.status(401).send('Not found');

})


module.exports = router;