const Countries = require('../models/countries');

exports.getCountries = async (req, res) => {

    let countries = null;
    try {
        countries = await Countries.find({});
    } finally {
        res.send(countries);
    }

}