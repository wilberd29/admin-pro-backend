const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuarios');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        //verificar Email
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        //verificar Contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password)
        console.log(password);
        console.log(usuarioDB.password);

        //const salt = bcrypt.genSaltSync();
        //const result = bcrypt.compareSync('12345', usuarios[1].password); // true
        //console.log(result);

        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'Contraseña no valida'
            });
        }

        //generar el TOKEN JWT
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            msg: 'Hola Mundo',
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: ' Hable con el administrador'
        })
    }
}


const googleSignIn = async(req, res = response) => {

    const googleToken = req.body.token;

    try {
        //console.log(googleToken);
        const { name, email, picture } = await googleVerify(googleToken);
        //const prueba = await googleVerify(googleToken);
        console.log('Correo: ' + email);

        //buscar por el usuario logeado autenticado google
        const usuarioDB = await Usuario.findOne({ email });
        console.log(usuarioDB);

        if (!usuarioDB) {
            //si no existe el usuario
            Usuario = new Usuario({
                nombre: name,
                email: email,
                password: '12345',
                img: picture,
                google: true
            });
        } else {
            //existe usuario
            usuario = usuarioDB;
            usuario.google = true;
            //usuario.img = picture
            //usuario.password = '12345';
        }

        //guardar en base de datos
        await usuario.save();

        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            msg: 'Google SignIn',
            googleToken: googleToken,
            token: token
        });
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto: ' + error
        });
    }

}


module.exports = {
    login,
    googleSignIn
}