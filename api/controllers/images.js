const path = require('path');
const Images = require('../models/images');
const mongoose = require('mongoose');
const mkdirp = require('mkdirp');
const multer = require('multer');
const Jimp = require('jimp');

exports.multer = multer({
    storage: multer.diskStorage({
        destination: (req, res, cb) => {
            let dest = 'public/' + req.user + '/';
            mkdirp.sync(dest);
            cb(null, dest);
        },
        filename: async (req, file, cb) => {
            if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
                cb('Only JPG / PNG / JPEG formats are supported');
                return;
            }

            let user = mongoose.Types.ObjectId(req.user);

            let domain = req.protocol + '://' + req.get('host');

            let image = new Images({ user, src: domain, src250: domain });
            image.save(async (err, data) => {

                if (err) {
                    cb(err);
                } else {
                    req.image = image;
                    cb(null, data._id.toString() + '.jpeg');
                }

            });
        }
    })
}).single('image');

exports.upload = (req, res) => {

    Jimp.read(path.resolve(__dirname, `../${req.file.path}`))
        .then(image => {
            return image
                .cover(250, 250)
                .write(
                    path.resolve(
                        __dirname, `../${req.file.path.split('.jpeg')[0]}x250.jpeg`
                    )
                )
        })
        .then(() => {
            res.send(req.image);
        });
    
};

