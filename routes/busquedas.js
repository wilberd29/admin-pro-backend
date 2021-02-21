/*
ruta: api/todo/:busqueda
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getTodo, getDocumentosColleccion } = require('../controllers/busquedas');
const router = Router();


//Busqueda por valor
router.get('/:busqueda', validarJWT, getTodo);

//Busqueda por Colleccion
router.get('/:coleccion/:tabla/:busqueda', validarJWT, getDocumentosColleccion);

module.exports = router;