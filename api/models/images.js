const mongoose = require('mongoose');

const user = {
    type: mongoose.Types.ObjectId,
    ref: 'Users',
    required: true
};

const src = {
    type: String,
    required: true,
    set: function(domain){
        return `${domain}/public/${this.user}/${this._id}.jpeg`;
    }
};

const src250 = {
    type: String,
    required: true,
    set: function(domain){
        return `${domain}/public/${this.user}/${this._id}x250.jpeg`;
    }
};

const Images = mongoose.Schema({
    user,
    src,
    src250
}, {
    toJSON: {
        virtuals: true 
    },
    toObject: {
        virtuals: true
    }
});

module.exports = mongoose.model('Images', Images);