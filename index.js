const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');


//crear el servidor de express
const app = express();

//Configurar CORS
app.use(cors());

//Lectura del body y parseo
app.use(express.json());

//Base de datos
dbConnection();

//Directorio publico
app.use(express.static('public'));


//ver variables de entorno
//console.log(process.env)
//Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/getBuscar', require('./routes/busquedas'));
app.use('/api/uploads', require('./routes/uploads'));

//Rutas
app.get('/', (req, res) => {
    res.json({
        ok: true,
        msg: 'Hola Wilber'
    })
});

//Rutas usuario
// app.get('/api/usuarios', (req, res) => {
//     res.json({
//         ok: true,
//         usuarios: [{
//             id: 123,
//             nombre: 'Wilber Donayres'
//         }]
//     })
// });

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});