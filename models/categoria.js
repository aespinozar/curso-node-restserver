const {Schema, model, Types, default: mongoose} = require('mongoose');
const usuario = require('./usuario');
const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true,'El Nombre es Obligatorio'],
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
    }

});

//esta funcion quita los campos _v y estado y el resto los almacena en variable dato
CategoriaSchema.methods.toJSON = function(){
    const {__v,estado, ...dato } = this.toObject();
    return dato;
}
//const Usuario = mongoose.model('Usuario',usuario.Schema);
module.exports = model('Categoria',CategoriaSchema);
