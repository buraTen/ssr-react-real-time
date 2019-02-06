const { getFriends, getIndexBySocketId } = require('../sockets/utils');

exports.Connect = async socket => {
    
    global.sockets.push({
        socket: socket.id, id: socket.user._id.toString(), username: socket.user.username
    });

    let to = await getFriends(socket.user.id);
    
    global.io.to(to).emit('changeStatus', { friend: socket.user.id, status: 'online' });

}

exports.Disconnect = async socket => {

    socket.on('disconnect', async () => {
        let friends = await getFriends(socket.user.id);
        global.io.to(friends).emit('changeStatus', { friend: socket.user.id, status: 'offline' });
        let index = getIndexBySocketId(socket.id);
        global.sockets.splice(index, 1);
    });

}