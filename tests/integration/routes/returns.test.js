const moment = require('moment');
const { Rental } = require('../../../models/rental');
const { Movie } = require('../../../models/movies');
const { User } = require('../../../models/users')
const mongoose = require('mongoose');
const request = require('supertest');


describe('api/returns', () => {
    let server;
    let rental;
    let customerId;
    let movieId;
    let tokken;
    let movie;

    const exec = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-tokken', tokken)
            .send({ customerId, movieId });
    }

    beforeEach(async () => {
        server = require('../../../index');

        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();
        tokken = new User().getAuthToken();

        movie = new Movie({
            _id: movieId,
            title: 'g1234',
            genre: { name: 'action' },
            numberInStock: 10,
        })
        await movie.save();


        rental = new Rental({
            customer: { _id: customerId, name: '12345', phone: '12345' },
            movie: { _id: movieId, title: 'my name', dailyRentalRate: 2 }
        })
        await rental.save();
    });
    afterEach(async () => {
        await Movie.collection.deleteMany({});
        await Rental.collection.deleteMany({});
        await server.close();
    })

    describe('Post /', () => {
        it('should return 401 if not logged in', async () => {
            tokken = ''
            const res = await exec();

            expect(res.status).toBe(401)
        })

        it('should return 400 if no customer Id in not provided', async () => {
            customerId = ''
            const res = await exec();
            expect(res.status).toBe(400)
        })

        it('should return 400 if no movie Id in not provided', async () => {
            movieId = ''
            const res = await exec();
            expect(res.status).toBe(400)
        })

        it('should return 400 if no object found', async () => {
            customerId = new mongoose.Types.ObjectId();
            const res = await exec();

            expect(res.status).toBe(400)
        })

        it('should return 400 if the out is already processed', async () => {
            rental.dateReturned = new Date();
            await rental.save();

            const res = await exec();

            expect(res.status).toBe(400);

        })

        it('should return valid rental fee if input is valid', async () => {
            const days = -7;
            rental.dateOut = new moment().add(days, 'days').toDate();
            await rental.save();

            const res = await exec();

            expect(res.body.rentalFee).toBe(days * -1 * rental.movie.dailyRentalRate)

        })

        it('should return the movie with +1 in stock if inputis valid', async () => {
            const res = await exec();
            const m = await Movie.findById(res.body.movie._id);
            expect(m.numberInStock).toBe(movie.numberInStock + 1);
        })
    })
})