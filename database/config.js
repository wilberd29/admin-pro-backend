const mongoose = require('mongoose');
require('dotenv').config();
const dbConnection = async() => {
    //Promesa
    try {
        await mongoose.connect(process.env.DB_CONNECT, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('DB Online ');

    } catch (error) {
        console.log(error);
        throw new error('Error en iniciar la base de datos');
    }
}

module.exports = {
    dbConnection
}