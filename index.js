const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');


//crear el servidor de express
const app = express();

//Configurar CORS
app.use(cors());

//Base de datos
dbConnection();

//ver variables de entorno
//console.log(process.env)

//Rutas
app.get('/', (req, res) => {
    res.json({
        ok: true,
        msg: 'Hola Wilber'
    })
});

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});