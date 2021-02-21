/*
Medicos
Ruta: 'api/medico
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');
const {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
} = require('../controllers/medicos')

const router = Router();

//Obtener medicos
router.get('/', getMedicos);

//Crear nuevo medico
router.post('/', [
        validarJWT,
        check('nombre', 'El nombre del médico es necesario').not().isEmpty(),
        check('hospital', 'El hospital id debe de ser válido').isMongoId(),
        validarCampos
    ],
    crearMedico
);

//Actualizar medico
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre del médico es necesario').not().isEmpty(),
    check('hospital', 'El hospital id debe de ser válido').isMongoId(),
    validarCampos

], actualizarMedico);


//Eliminar medico
router.delete('/:id',
    validarJWT,
    borrarMedico
);


module.exports = router;