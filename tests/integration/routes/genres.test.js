const request = require('supertest');
const { Genere } = require('../../../models/genres');
const mongoose = require('mongoose');


describe('/api/genres', () => {
    let server;
    beforeEach(() => {
        server = require('../../../index');
    });
    afterEach(async () => {
        await Genere.collection.deleteMany({});
        await server.close()
    })

    describe('Get /', () => {
        it('should return all genres', async () => {
            await Genere.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ])
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2)
        })
    })

    describe('Get /:id', () => {
        it('should return error if object Id in invalid', async () => {
            const res = await request(server).get('/api/genres/2');
            expect(res.status).toBe(400);
        })

        it('should return 404 if object id didnt match', async () => {
            const res = await request(server).get('/api/genres/64be2a3f2f5d7f3790f09b11')
            expect(res.status).toBe(404)
        })

        it('should return valid object if found', async () => {
            const obj = await Genere.create({ name: 'genre1' });
            const res = await request(server).get(`/api/genres/${obj._id}`);
            expect(res.body).toHaveProperty('name', obj.name);
            expect(mongoose.Types.ObjectId.isValid(res.body._id)).toBeTruthy();
        })
    })


})