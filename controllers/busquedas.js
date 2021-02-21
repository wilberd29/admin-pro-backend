//getTodo

const { response } = require('express');
const Usuario = require('../models/usuarios');
const Medico = require('../models/medico');

const getTodo = async(req, res = response) => {
    const busqueda = req.params.busqueda; //por params
    const regex = new RegExp(busqueda, 'i'); //expression regular insensible

    console.log(busqueda);
    if (typeof busqueda === "") {
        console.log(busqueda);
    }


    const [usuarios, medicos] = await Promise.all([
        Usuario.find({ nombre: regex }),
        Medico.find({ nombre: regex })
    ]);


    res.json({
        ok: true,
        buscar: busqueda,
        Usuario: usuarios,
        Medico: medicos
    })
}

//------------------------------------------------------------------------
//Busquda por nombre de tabla
const getDocumentosColleccion = async(req, res = response) => {
    const tabla = req.params.tabla; //por params
    const busqueda = req.params.busqueda; //por params
    const regex = new RegExp(busqueda, 'i'); //expression regular insensible

    let data = [];
    switch (tabla) {
        case 'usuarios':
            data = await Usuario.find({ nombre: regex });
            break;
        case 'hospitales':
            data = await Hospital.find({ nombre: regex })
                .populate('usuario'), 'nombre img';
            break;
        case 'medicos':
            data = await Medico.find({ nombre: regex })
                .populate('medicos'), 'nombre img';
            break;

        default:
            res.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser usuarios/medicos/hospitales'
            });

    }

    res.json({
        ok: true,
        resultados: data
    })
}

module.exports = {
    getTodo,
    getDocumentosColleccion
}