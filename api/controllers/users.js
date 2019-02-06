const Users = require('../models/users');
const mongoose = require('mongoose');
const Countries = require('../models/countries');
const jwt = require('jsonwebtoken');
const Friendships = require('../models/friendships');
const { getSocketByUserId } = require('../sockets/utils');
const Images = require('../models/images');

exports.getUser = async (req, res) => {
    
    let username = req.params.username;
    let user = {};

    try {

        user = await Users.findOne({ username }, 'first last quote username email country birth gender avatar background')
            .populate('country', 'name -_id')
            .populate('avatar', 'src250')
            .populate('background', 'src')
            .exec();

        user = user.toObject();

        let friends = await Friendships.getFriends(user._id.toString(), 'username first last gender country avatar');
        user.friends = friends.active;

        let images = await Images.find({ user: user._id });
        user.images = images;

    } catch (e) {
        user = {};
    }
    
    user = user || {};
    res.send(user);

};

exports.newUser = async (req, res) => {

    let user = null;
    let errors = [];

    let birth;
    let day = Number(req.body.day);
    let month = Number(req.body.month) - 1;
    let year = Number(req.body.year);
    
    if (day > 0 && day < 32 && month >= 0 && month < 12 && year < 2001 && year > 1940) {
        birth = new Date(Date.UTC(req.body.year, req.body.month - 1, req.body.day)).getTime();
    }
    
    let request = {
        first: req.body.first,
        last: req.body.last,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        birth,
        gender: req.body.gender,
        country: req.body.country
    };

    let country = await Countries.findOne({ code: request.country }, '_id');

    if (!country) {
        errors.push('Country not found');
    } else {

        request.country = country._id;
        let User = new Users(request);

        try {
            user = await User.save();
        } catch (e) {
            Object.values(e.errors).map(err => errors.push(err.message));
        }

    }

    res.send({ user, errors });

};

exports.signIn = async (req, res) => {
    
    let username = req.body.username;
    let password = req.body.password;
    let user;
    let token = null;

    let query = {
        $or: [
            { username },
            { email: username }
        ],
        password
    };

    user = await Users.findOne(query, 'token');

    if (user) {

        token = user.token;
        
        try {
            jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            
            let data = {
                id: user._id,
                username: user.username
            };

            token = jwt.sign({ data }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

            try {
                await Users.findOneAndUpdate({ _id: data.id }, { token });
            } catch (e) {
                token = null;
            }

        }

    }

    res.send({ token });

}

exports.auth = async (req, res) => {
    
    let id = req.user;
    let response = {};

    let user = await Users.findById(id, 'first last name avatar background username messages notifications gender')
        .populate('notifications.user', 'username first last name')
        .populate('avatar', 'src250')
        .populate('background', 'src')
        .exec();
    
    let friends = await Friendships.getFriends(id, 'messages username avatar gender');
    
    for (let i = 0; i < friends.active.length; i++) {

        friends.active[i] = friends.active[i].toObject();
        let socket = getSocketByUserId(friends.active[i]._id.toString());

        if (socket) {
            friends.active[i].status = 'online';
        } else {
            friends.active[i].status = 'offline';
        }

    }
    
    try {

        let images = await Images.find({ user: user._id });

        response.user = user;
        response.user = response.user.toObject();
        response.notifications = response.user.notifications;
        delete response.user.notifications;
        response.friends = friends;
        response.user.images = images;

    } catch (e) {
        res.send({});
    }
    
    res.send(response);

}

exports.readMessages = async (req, res) => {
    
    let { user } = req.body;

    await Users.updateOne({
        _id: mongoose.Types.ObjectId(req.user),
        "messages.unread": true,
        "messages.by": mongoose.Types.ObjectId(user)
    },{
        $set: { "messages.$[].unread": false }
    });

    res.send({user: req.user});

}

exports.readNotifications = async (req, res) => {

    await Users.updateOne({
        _id: mongoose.Types.ObjectId(req.user),
        "notifications.unread": true,
    },{
        $set: { "notifications.$[].unread": false }
    });
    
    res.send({ success: true });

}

exports.deleteNotifications = async (req, res) => {

    let { id } = req.body;
    
    await Users.updateOne({
        _id: mongoose.Types.ObjectId(req.user)
    },{
        $pull: { notifications: { _id: id } }
    });
    console.log(id)
    res.send({ success: true });

}

exports.changeAvatar = async (req, res) => {

    let avatar = req.body.avatar;
    let { user } = req;

    let resp = await Users.changeImage(user, avatar, 'avatar');
    res.send(resp);

}

exports.changeBackground = async (req, res) => {

    let background = req.body.background;
    let { user } = req;
    
    let resp = await Users.changeImage(user, background, 'background');
    console.log(resp)
    res.send(resp);

}

exports.search = async (req, res) => {

    let search = req.params.query;
    let query = { $regex: search, $options: 'i' };

    let users = await Users.find({
        $or: [ { username: query }, { first: query }, { last: query } ]
    },
        'first last username email avatar background gender country'
    )
    .populate('avatar', 'src250')
    .populate('background', 'src')
    .populate('country', 'name')
    .exec();
    
    res.send(users);

}

exports.suggested = async (req, res) => {

    let id = req.user;
    
    let allUsers = await Users.find({ _id: { $ne: id } }, 'username first last name avatar country')
        .populate('avatar country')
        .exec();

    let friendships = await Friendships.getFriends(id, '_id');
    
    let friends = [];
    for (let i = 0; i < friendships.active.length; i++) {
        friends.push(friendships.active[i]._id.toString());
    }
    for (let i = 0; i < friendships.requests.length; i++) {
        friends.push(
            friendships.requests[i].by._id === id ? 
                id.toString() 
            : 
                friendships.requests[i].to._id.toString()
        );
    }
    
    let nonFriendUsers = [];
    for (let i = 0; i < allUsers.length; i++) {
        if (!friends.includes(allUsers[i]._id.toString())) {
            nonFriendUsers.push(allUsers[i]);
        }
    }

    function getRandom(arr, n){
        let result = new Array(n > arr.length ? n = arr.length : n);
        let len = arr.length;
        let taken = new Array(len);
        while (n--) {
            var x = Math.floor(Math.random() * len);
            result[n] = arr[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }
        return result;
    }

    res.send(getRandom(nonFriendUsers, 10));

}