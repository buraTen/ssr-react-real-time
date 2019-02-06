const friendships = require('../models/friendships');

exports.getIndexBySocketId = id => {

    return global.sockets.map(s => s.socket).indexOf(id);

};

exports.getSocketByUserId = id => {

    let index = global.sockets.map(s => s.id).indexOf(id);
    return global.sockets[index];

}

exports.getFriends = async id => {

    let friends = await friendships.getFriends(id, 'username');
    let arr = [];

    for (let i = 0; i < friends.active.length; i++) {
        let friend = friends.active[i];
        
        for (let k = 0; k < global.sockets.length; k++) {
            if (global.sockets[k].id === friend.id) {
                arr.push(global.sockets[k].socket);
            }
        }
    }

    return arr;

}