const friendships = require('../models/friendships');
const { getIndexBySocketId, getFriends } = require('./utils');
const Message = require('./message');
const Friendships = require('./friendships');
const { Connect, Disconnect } = require('./users');

global.sockets = [];

module.exports = async socket => {

    Connect(socket);

    Message(socket);

    Friendships(socket);

    Disconnect(socket)

}
