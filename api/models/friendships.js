const mongoose = require('mongoose');

const user = {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Users'
};

const active = {
    type: Boolean,
    default: false
};

const Friendships = new mongoose.Schema({
    by: user,
    to: user,
    active
}, {
    toJSON: {
        virtuals: true 
    },
    toObject: {
        virtuals: true
    }
});

Friendships.statics.getFriends = async function(id, select){

    let friends = [];
    let requests = [];

    let query = {
        $or: [
            { by: mongoose.Types.ObjectId(id) },
            { to: mongoose.Types.ObjectId(id) }
        ]
    };

    let allFriends = await this.find(query)
        .populate({ path: 'by', select, populate: [{ path: 'country' }, { path: 'avatar' }] })
        .populate({ path: 'to', select, populate: [{ path: 'country' }, { path: 'avatar' }] })
        .exec();
    
    for (let i = 0; i < allFriends.length; i++) {

        let friend;

        if (allFriends[i].by.id === id) {
            friend = allFriends[i].to;
        } else {
            friend = allFriends[i].by;
        }
        
        if (friend) {
            
            let messages = [];
            if (allFriends[i].active) {

                if (friend.messages) {
                    for (let k = 0; k < friend.messages.length; k++) {
                        if (friend.messages[k].by.toString() === id) {
                            messages.push(friend.messages[k]);
                        }
                    }
                }

                friend.messages = messages;
                friends.push(friend);

            } else {

                let by = allFriends[i].by.toObject();
                let to = allFriends[i].to.toObject();
                
                delete by.messages;
                delete to .messages;

                requests.push({
                    by,
                    to
                });

            }
            
        }

    }
    
    for (let k = 0; k < friends.length; k++) {
        if (friends[k].id === id.toString()) {
            friends.splice(k, 1);
        }
    }
    
    return { active: friends, requests }

}

Friendships.statics.friendship = async function(by, to) {

    let status;
    let user = mongoose.Types.ObjectId(by);

    let query = {
        $or: [
            { $and: [ { by }, { to } ] },
            { $and: [ { by: to }, { to: by } ] }
        ]
    };
    let friendship = await this.findOne(query);

    if (friendship) {
        
        if (friendship.active) {
            
            await this.deleteOne(query);

            user = { id: by };

            status = 'remove';

        } else {

            if (friendship.to.equals(by) && !friendship.by.equals(by)) {

                await this.updateOne(query, { active: true });

                status = 'accept';

            } else if(friendship.by.equals(by) && !friendship.to.equals(by)) {

                await this.deleteOne(query);

                status = 'removeRequest';

            } else {

                await this.deleteOne(query);
                user = mongoose.Types.ObjectId(to);
                status = 'remove';

            }

        }

    } else {

        let newFriendship = new this({ by, to });
        await newFriendship.save();

        status = 'request';

    }

    user = await this.model('Users').findOne({
        _id: user
    }, '_id username country gender avatar').populate('avatar').exec();
    
    return { status, user };

}

module.exports = mongoose.model('Friendships', Friendships);