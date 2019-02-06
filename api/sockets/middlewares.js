const jwt = require('jsonwebtoken');
const users = require('../models/users');

exports.verifyToken = async (socket, next) => {

    let token = socket.handshake.query.token;
    
    try {
        
        let { data } = jwt.verify(token, process.env.JWT_SECRET);
        let user = await users.findOne({ _id: data.id }, 'username');
        socket.user = user; 
        next();

    } catch (error) {
        next(new Error('Unauthorized'));
    }
    
};