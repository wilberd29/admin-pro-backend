/*
ruta: api/upload/:tabla/:id
 */
const { Router } = require('express');
const expressFileUpload = require('express-fileupload');

const { validarJWT } = require('../middlewares/validar-jwt');
const { fileUpload, retornaImagen } = require('../controllers/uploads');
const router = Router();

router.use(expressFileUpload());

//subir archivo
router.put('/:tabla/:id', validarJWT, fileUpload);

//leer el archivo imagen
router.get('/:tabla/:foto', retornaImagen);

module.exports = router;