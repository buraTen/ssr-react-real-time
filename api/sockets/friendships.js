const mongoose = require('mongoose');
const friendships = require('../models/friendships');
const users = require('../models/users');
const { getSocketByUserId } = require('./utils');

module.exports = async socket => {

    socket.on('friendship', async to => {

        to = mongoose.Types.ObjectId(to);
        let by = socket.user._id;

        let friendship = await friendships.friendship(by, to);

        let emit = getSocketByUserId(to.toString());
        
        let notification;

        if (friendship.status === 'request') {
            notification = await users.newNotification(to, by, 'friendship/request');
        }
        
        if (emit) {
            global.io.to(emit.socket).emit('friendship', friendship);

            if (friendship.status === 'request') {
                global.io.to(emit.socket).emit('notification', notification);
            }
        }

    });

}