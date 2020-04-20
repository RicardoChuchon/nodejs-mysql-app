const bcrypt = require('bcryptjs');

const helpers = {};

helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

helpers.matchPassword = async (password, savedPassword) => {
    //await bcrypt.compare(password, savedPassword);
    try {
        console.log(password);
        console.log(savedPassword);
        return await bcrypt.compare(password, savedPassword);
    } catch (e) {
        console.log(e);
    }
};


module.exports = helpers;