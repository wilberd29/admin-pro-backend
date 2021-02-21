const path = require('path');
const fs = require('fs');

const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagenBD } = require('../helpers/actualizar-imagen');

const fileUpload = (req, res = response) => {
    const tabla = req.params.tabla;
    const id = req.params.id;

    //validar tabla
    console.log(tabla);

    const tablasValidas = ['hospitales', 'medicos', 'usuarios'];
    if (!tablasValidas.includes(tabla)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es una tabla correcta'
        });
    }
    //validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningun archivo a subir.'
        })
    }
    //Procesar la imagen
    const file = req.files.imagen;
    console.log(file);
    //extraer la extendion del archivo

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];
    //validar exension
    const extensionValida = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionValida.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un extension permitida'
        });
    }

    //Generar el nombre de archivo unico
    //utilizar el uuid
    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;

    //path para guardar la imagen
    const path = `./uploads/${ tabla }/${ nombreArchivo }`;

    //usar para mover la imagen
    file.mv(path, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }

        //res.send('File uploaded!');
    });

    //Actualizar la base de 
    actualizarImagenBD(tabla, id, nombreArchivo);


    res.json({
        ok: true,
        msg: 'Archivo subido ',
        nombreArchivo
    });
}

const retornaImagen = (req, res = response) => {

    const tabla = req.params.tabla;
    const foto = req.params.foto;
    const pathImg = path.join(__dirname, `../uploads/${ tabla }/${ foto }`);

    // imagen por defecto
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        const pathImg = path.join(__dirname, `../uploads/no-img.png`);
        res.sendFile(pathImg);
    }

}

module.exports = {
    fileUpload,
    retornaImagen
}