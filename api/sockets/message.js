const users = require('../models/users');
const { getSocketByUserId } = require('./utils');

module.exports = async socket => {
    
    socket.on('newMessage', async data => {
        
        data.by = socket.user.id;
        data.date = new Date().getTime();

        await users.newMessage(data.to, socket.user.id, data.message);
        
        let by = getSocketByUserId(socket.user.id);
        let to = getSocketByUserId(data.to);

        try {
            global.io.to(by.socket)
                .to(to.socket)
                .emit('newMessage', data);
        } catch (e) {
            global.io.to(by.socket).emit('newMessage', data);
        }

    });

}