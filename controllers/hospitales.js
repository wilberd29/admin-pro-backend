const { response } = require('express');
const { validationResult } = require('express-validator');
const Hospital = require('../models/hospital');
const { generarJWT } = require('../helpers/jwt');

const getHospitales = async(req, res = response) => {

    const hospitales = await Hospital.find({})
        .populate('usuario', 'nombre img');

    res.json({
        ok: true,
        hospitales
    })
}

const crearHospital = async(req, res = response) => {

    const { nombre } = req.body;

    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });

    try {
        const existeNombre = await Hospital.findOne({ nombre });
        if (existeNombre) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre de Hospital ya esta registrado'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error en buscar Hospital..revisar log: ' + error
        });
    }

    try {

        const hospitalDB = await hospital.save();


        res.json({
            ok: true,
            hospital: hospitalDB
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const actualizarHospital = async(req, res) => {

    res.json({
        ok: true,
        msg: 'actualizarHospital',
    })
}

const borrarHospital = async(req, res) => {

    res.json({
        ok: true,
        msg: 'borrarHospital',
    })
}


module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}