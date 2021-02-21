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


const actualizarMedico = async(req, res = response) => {
    const id = req.params.id;
    const uid = req.uid;

    try {
        const medico = await Medico.findById(id);
        if (!medico) {
            return res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por id',
            });
        }

        //medico.nombre = req.body.nombre;
        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, { new: true });
        res.json({
            ok: true,
            msg: 'actualizar Medico',
            medico: medicoActualizado
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con administrador' + error
        })
    }
}


const borrarMedico = async(req, res) => {

    const id = req.params.id;

    try {
        const medico = await Medico.findById(id);
        if (!medico) {
            return res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por id',
            });
        }

        await Medico.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Medico Eliminado'
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con administrador' + error
        })
    }
}



module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}