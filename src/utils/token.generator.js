const jwt = require('jsonwebtoken');

const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
};

const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
};

const generateTemporaryToken = (userId) => {
    return jwt.sign({ userId }, process.env.TEMPORARY_TOKEN_SECRET, { expiresIn: '15m' });
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    generateTemporaryToken
};
