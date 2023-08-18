const {Schema, model, Types, default: mongoose} = require('mongoose');
const usuario = require('./usuario');
const categoria = require('./categoria');
const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El Nombre es Oblegatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: {type:String},
    disponible: {type:Boolean, default:true},
    img: {type:String},
});
//esta funcion quita los campos _v, estado y el resto de campos lo almacena en dato
ProductoSchema.methods.toJSON = function(){
    const {__v,estado,...dato} = this.toObject();
    return dato;

}
module.exports = model('Producto',ProductoSchema);