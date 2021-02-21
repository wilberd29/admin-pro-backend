const { response } = require('express');
const { validationResult } = require('express-validator');
const Medico = require('../models/medico');
const { generarJWT } = require('../helpers/jwt');


const getMedicos = async(req, res = response) => {

    const medicos = await Medico.find()
        .populate('usuario', 'nombre img')
        .populate('hospital', 'nombre img')

    res.json({
        ok: true,
        medicos
    })
}


const crearMedico = async(req, res = response) => {

    const { nombre } = req.body;
    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

    try {
        const existeNombre = await Medico.findOne({ nombre });
        if (existeNombre) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre de Medico ya esta registrado'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error en buscar Medico..revisar log: ' + error
        });
    }

    try {
        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador' + error
        })
    }
}


const actualizarMedico = async(req, res) => {

    res.json({
        ok: true,
        msg: 'actualizarMedico',
    })
}

const borrarMedico = async(req, res) => {

    res.json({
        ok: true,
        msg: 'borrarMedico',
    })
}


module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}