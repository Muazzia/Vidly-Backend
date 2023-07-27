const request = require('supertest');
const { Genere } = require('../../../models/genres');
const mongoose = require('mongoose');
let server;
let app;


describe('/api/genres', () => {
    beforeEach(() => { ({ app: app, server: server } = require('../../../index')) });
    afterEach(async () => { server.close(), await Genere.deleteMany({}), await mongoose.connection.close(); })

    describe('Get /', () => {
        it('should return all genres', async () => {
            await Genere.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ])
            const res = await request(server).get('/api/genres');
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
        })
    })

    describe('Get /:id', () => {

    })
})