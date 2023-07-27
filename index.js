const dotenv = require('dotenv')
const express = require('express');
const mongoose = require('mongoose');

const environment = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${environment}` });

const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rental');
const users = require('./routes/users');
const auth = require('./routes/auth');


const app = express();

mongoose.connect(process.env.db)
    .then(() => console.log(`Connected to ${process.env.db}`))
    .catch((err) => console.error(err))


app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);


const port = process.env.POST || 3000;
app.listen(port, () => console.log(`listening to port ${port}`))