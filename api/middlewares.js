const jwt = require('jsonwebtoken');

exports.cors = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", 'Authorization, Content-Type, Accept, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
}

exports.verifyToken = (req, res, next) => {

    let bearer = req.headers.authorization;
    
    try {

        if(!bearer) throw new Error();
        let token = bearer.split('Bearer ')[1];
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.data.id;
        next();

    } catch (e) {
        res.status(401).end();
    }

}