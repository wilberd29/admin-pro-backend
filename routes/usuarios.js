/*
Controlador
Ruta: /api/usuarios
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios')
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();

// router.get('/', (req, res) => {
//     res.json({
//         ok: true,
//         usuarios: [{
//             id: 123,
//             nombre: 'Wilber Donayres Olayunca'
//         }]
//     })
// });

//Obtener usuario
//router.get('/', getUsuarios);
router.get('/', validarJWT, getUsuarios);

//Actualizar usuario
router.put('/:id', [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('role', 'El role es obligatorio').not().isEmpty(),
    ],
    actualizarUsuario
);

//Crear nuevo usuario
router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
    ],
    crearUsuario);




//Eliminar usuario
router.delete('/:id',
    validarJWT,
    borrarUsuario
);


module.exports = router;