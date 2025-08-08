const jwt = require('jsonwebtoken');

const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
};

const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
};

module.exports = {
    generateAccessToken,
    generateRefreshToken
};
