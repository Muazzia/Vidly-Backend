const { User } = require('../models/users');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const environment = process.env.NODE_ENV;
dotenv.config({ path: `.env.${environment}` });

describe('users', () => {
    it('should return a valid jwt tokken', () => {
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        }
        const user = new User(payload);
        const tokken = user.getAuthToken();
        const decoded = jwt.verify(tokken, process.env.jwtPrivateKey);
        expect(decoded).toMatchObject(payload);
    })
})