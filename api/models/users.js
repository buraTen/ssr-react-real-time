const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { capitalize } = require('../utils');

const name = {
    type: String,
    minlength: [ 2, 'Enter {PATH}name between 2 - 12' ],
    maxlength: [ 12, 'Enter {PATH}name between 2 - 12' ],
    set: v => capitalize(v),
    required: [ true, '{PATH}name is required']
};

const username = {
    type: String,
    minlength: [ 5, 'Enter username between 5 - 14' ],
    maxlength: [ 14, 'Enter username between 5 - 14' ],
    required: [ true, 'username is required'],
    unique: true
};

const email = {
    type: String,
    minlength: [ 5, 'Enter e-mail between 5 - 22' ],
    maxlength: [ 22, 'Enter e-mail between 5 - 22' ],
    required: [ true, 'e-mail is required'],
    unique: true,
    match: [ /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Invalid e-mail' ]
};

const avatar = {
    type: mongoose.Types.ObjectId,
    ref: 'Images',
    default: null
};

const background = {
    type: mongoose.Types.ObjectId,
    ref: 'Images',
    default: null
};

const quote = {
    type: String,
    minlength: [ 5, 'Enter quote between 5 - 22' ],
    maxlength: [ 300, 'Enter e-mail between 5 - 300' ],
    default: function(){
        let quotes = [
            'The most difficult thing is the decision to act, the rest is merely tenacity. The fears are paper tigers. You can do anything you decide to do. You can act to change and control your life; and the procedure, the process is its own reward.',
            'Do not mind anything that anyone tells you about anyone else. Judge everyone and everything for yourself.',
            'If you cannot do great things, do small things in a great way.',
            'Keep your face always toward the sunshine - and shadows will fall behind you.',
            'I have not failed. I\'ve just found 10,000 ways that won\'t work.',
            'Success is not final, failure is not fatal: it is the courage to continue that counts.',
            'Do not go where the path may lead, go instead where there is no path and leave a trail.'
        ];
        return quotes[Math.floor(Math.random()*quotes.length)];
    }
};

const gender = {
    type: String,
    enum: ['male', 'female'],
    default: 'male',
    required: [ true, 'gender is required']
};

const messages = [{
    by: {
        type: mongoose.Types.ObjectId,
        ref: 'Users'
    },
    message: String,
    unread: {
        type: Boolean,
        default: true
    },
    date: {
        type: Number,
        default: new Date().getTime()
    }
}];

const notifications = [{
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'Users'
    },
    type: {
        type: String,
        required: true,
        enum: ['friendship/request']
    },
    unread: {
        type: Boolean,
        default: true
    },
    date: {
        type: Number,
        default: new Date().getTime()
    }
}];

const country = {
    type: mongoose.Types.ObjectId,
    ref: 'Countries',
    required: true
};

const password = {
    type: String,
    minlength: [ 5, 'Enter password between 5 - 22' ],
    maxlength: [ 22, 'Enter password between 5 - 22' ],
    required: [ true, 'password is required']
};

const birth = {
    type: Number,
    required: [ true, 'birth date is required']
};

const date = {
    type: Number,
    default: new Date().getTime()
};

const token = {
    type: String,
    default: null
};

const Users = new mongoose.Schema({
    first: name,
    last: name,
    username,
    email,
    avatar,
    background,
    quote,
    gender,
    messages,
    notifications,
    country,
    password,
    birth,
    date,
    token
}, {
    toJSON: {
        virtuals: true 
    },
    toObject: {
        virtuals: true
    }
});

Users.plugin(uniqueValidator, { paths: ['username'], message: 'Try another {PATH}' });

Users.virtual('name').get(function(){
    return this.first + ' ' + this.last;
});

Users.statics.newMessage = async function(to, by, message){

    let resp = await this.findOneAndUpdate({
        _id: mongoose.Types.ObjectId(to)
    },
    {
        $push: {
            messages: {
                by: mongoose.Types.ObjectId(by),
                message,
                date: new Date().getTime()
            }
        }
    });

    return resp;

}

Users.statics.newNotification = async function(to, by, type){

    let user = await this.findOneAndUpdate({
        _id: mongoose.Types.ObjectId(to)
    },
    {
        $push: {
            notifications: {
                user: mongoose.Types.ObjectId(by),
                type
            }
        }
    },
    {
        new: true
    }).populate('notifications.user', 'first last username').exec();

    try {

        user = user.toObject();

        let notifications = user.notifications.sort((a, b) => new Date(a.date) - new Date(b.date));;
        return notifications[notifications.length - 1];

    } catch (e) {
        return null;
    }

}

Users.statics.changeImage = async function(user, image, field){

    if (field !== 'avatar' && field !== 'background') {
        return false;
    }

    image = mongoose.Types.ObjectId(image);
    user = mongoose.Types.ObjectId(user);

    try {

        let imageExists = await this.model('Images').findOne({ _id: image, user });

        if (imageExists) {
            
            let resp = await this.findOneAndUpdate({
                _id: user
            },
            {
                [field]: image
            },
            {
                new: true
            });

            return resp;

        } else {
            return false;
        }

    } catch (e) {
        return false;
    }

}

module.exports = mongoose.model('Users', Users);