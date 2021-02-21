//creat modelo de mongoose
const { Schema, model } = require('mongoose');
//const mongoose = require('mongoose');
//mongoose.Schema
//mongoose.model

//Crear estructura de Hospital
const HospitalSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
}, { collection: 'hospitales' });

HospitalSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
})

module.exports = model('Hospital', HospitalSchema);