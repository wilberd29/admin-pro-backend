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


const actualizarHospital = async(req, res = response) => {
    const id = req.params.id;
    const uid = req.uid;

    try {
        const hospital = await Hospital.findById(id);
        if (!hospital) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado por id',
            });
        }

        //hospital.nombre = req.body.nombre;
        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, { new: true });
        res.json({
            ok: true,
            msg: 'actualizarHospital',
            hospital: hospitalActualizado
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con administrador' + error
        })
    }
}


const borrarHospital = async(req, res = response) => {
    const id = req.params.id;

    try {

        const hospital = await Hospital.findById(id);
        if (!hospital) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado por id',
            });
        }

        await Hospital.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Hospital eliminado'
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con administrador' + error
        })
    }
}



module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}