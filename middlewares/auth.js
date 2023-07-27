const jwt = require('jsonwebtoken');


function auth(req, res, next) {
    const token = req.header('x-auth-tokken');

    if (!token) return res.status(401).send('Acces denied. No tokken provided');

    try {
        const decoded = jwt.verify(token, process.env.jwtPrivateKey);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).send('Invalid Tokken');
    }
}

module.exports = auth;