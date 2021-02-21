//funciones del controlador logica
const { response } = require('express');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const Usuario = require('../models/usuarios');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res) => {
    const desde = Number(req.query.desde) || 0; //por parametro url
    console.log(desde);

    // const usuarios = await Usuario.find({}, 'nombre email role password google, uid')
    //     .skip(desde)
    //     .limit(5);
    // const total = await Usuario.count();

    //Promesas de manera simultanea
    const [usuarios, total] = await Promise.all([
        Usuario.find({}, 'nombre email role password google, img')
        .skip(desde)
        .limit(5),
        Usuario.count()
    ]);


    //console.log(usuarios[1].password);

    const salt = bcrypt.genSaltSync();
    const result = bcrypt.compareSync('12345', usuarios[1].password); // true
    console.log(result);

    res.json({
        ok: true,
        usuarios,
        //uid = req.uid
        total: total
    })
}

const crearUsuario = async(req, res = response) => {
    console.log(req.body);

    const { email, password, nombre } = req.body;
    //obtener error del express-validator
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errores.mapped()
        });
    }

    //validando campo por campo
    try {
        //Validar Nombre vacio
        // if (!nombre) {
        //     return res.status(400).json({
        //         ok: false,
        //         msg: 'Debe ingresar el nombre'
        //     });
        // }

        //Validar Email existente
        const existeEmail = await Usuario.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error en buscar eMail..revisar log: ' + error
        });
    }

    try {
        const usuario = new Usuario(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);
        //Guardar usuario
        await usuario.save();

        //generar el TOKEN JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            msg: 'Creando Usuario',
            usuario: usuario,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado..revisar log: ' + error
        });
    }

}



const actualizarUsuario = async(req, res = response) => {

    // TODO: Validar token y comprobar si es el usuario correcto

    const uid = req.params.id;


    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        // Actualizaciones
        const { password, google, email, ...campos } = req.body;

        if (usuarioDB.email !== email) {

            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}


const borrarUsuario = async(req, res = response) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        await Usuario.findByIdAndDelete(uid);


        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }


}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}