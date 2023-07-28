const { Rental } = require('../../../models/rental');
const { User } = require('../../../models/users')
const mongoose = require('mongoose');
const request = require('supertest');


describe('api/returns', () => {
    let server;
    let rental;
    let customerId;
    let movieId;

    beforeEach(async () => {
        server = require('../../../index');

        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();

        rental = new Rental({
            customer: { _id: customerId, name: '12345', phone: '12345' },
            movie: { _id: movieId, title: 'my name', dailyRentalRate: 2 }
        })
        await rental.save();
    });
    afterEach(async () => {
        await server.close();
    })

    describe('Post /', () => {
        it('should return 401 if not logged in', async () => {
            const res = await request(server).post('/api/returns').send({ customerId, movieId });
            expect(res.status).toBe(401)
        })

        it('should return 400 if no customer Id in not provided', async () => {
            const tokken = new User().getAuthToken();
            const res = await request(server).post('/api/returns').set('x-auth-tokken', tokken).send({ movieId });
            expect(res.status).toBe(400)
        })

        it('should return 400 if no movie Id in not provided', async () => {
            const tokken = new User().getAuthToken();
            const res = await request(server).post('/api/returns').set('x-auth-tokken', tokken).send({ customerId });
            expect(res.status).toBe(400)
        })

        it('should return 404 if no object found', async () => {
            const tokken = new User().getAuthToken();
            const res = await request(server).post('/api/returns').set('x-auth-tokken', tokken).send({ movieId, customerId });

            const r = await Rental.findById(rental._id);
            expect(r).not.toBeNull();
            expect(r._id).toEqual(rental._id);
        })
    })
})