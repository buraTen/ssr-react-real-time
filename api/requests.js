const router = require('express').Router();
const users = require('./controllers/users');
const { verifyToken } = require('./middlewares');
const images = require('./controllers/images');
const countries = require('./controllers/countries');

router.post('/api/v1/images', verifyToken, images.multer, images.upload);

router.get('/api/v1/users/suggested', verifyToken, users.suggested);
router.put('/api/v1/users/avatar', verifyToken, users.changeAvatar);
router.put('/api/v1/users/background', verifyToken, users.changeBackground);
router.put('/api/v1/users/messages', verifyToken, users.readMessages);
router.put('/api/v1/users/notifications', verifyToken, users.readNotifications);
router.delete('/api/v1/users/notifications', verifyToken, users.deleteNotifications);
router.post('/api/v1/users/auth', verifyToken, users.auth);
router.post('/api/v1/users/signin', users.signIn);
router.get('/api/v1/users/:username', users.getUser);
router.post('/api/v1/users', users.newUser);
router.get('/api/v1/users/search/:query', users.search);

router.get('/api/v1/countries', countries.getCountries);

router.get('/*', (req, res) => {
    res.status(404).end();
});

module.exports = router;