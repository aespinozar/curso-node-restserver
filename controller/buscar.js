const {response} = require('express');
const { ObjectId } = require('mongoose').Types;
const {Usuario,Categoria,Producto} = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];
//esta funcion buscara por Id valido y Nombre de usuario. importar mongoose y models.
const buscarUsuarios = async(termino='', res=response)=>{
    //esto es para busqueda por Id valido
    const esMongoID = ObjectId.isValid(termino); //retorna true 
    if(esMongoID){
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }
    //busqueda por nombre o correo. Esta busqueda debe ser por aproximacion
    // debe primero hacerse que sea incencible a las minusculas. se usa exprecion regular
    const regex = new RegExp(termino, 'i');
    const usuarios = await Usuario.find({
       //se usa $or es el logico O: dice nombre = regex o correo = regex y estado = true
        $or: [{nombre: regex }, {correo: regex}],
        $and:  [{estado:true}]
    });
    res.json({
        results: usuarios
    });
};
// busca categoria por ID y Nombre
const buscarCategorias = async(termino='', res=response)=>{
    //esto es para busqueda por Id valido
    const esMongoID = ObjectId.isValid(termino); //retorna true 
    if(esMongoID){
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }
    //busqueda por nombre. Esta busqueda debe ser por aproximacion
    // debe primero hacerse que sea incencible a las minusculas. se usa exprecion regular
    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({nombre: regex, estado:true});
    res.json({
        results: categorias
    });
};

const buscarProductos = async(termino='', res=response)=>{
    //esto es para busqueda por Id valido
    const esMongoID = ObjectId.isValid(termino); //retorna true 
    if(esMongoID){
        const producto = await Producto.findById(termino)
                            .populate('categoria','nombre');
        return res.json({
            results: (producto) ? [producto] : []
        })
    }
    
    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({nombre: regex , estado: true})
                            .populate('categoria','nombre');
    res.json({
        results: productos
    });
};

const buscar = (req, res = response) => {
    const {coleccion,termino} = req.params;
    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son : ${coleccionesPermitidas}`
        })
        
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino,res);
             break;
        case 'productos':
            buscarProductos(termino,res);
            break;
        default:
            res.status(500).json({
                msg: 'sele olvido hacer esta busqueda'
            })
    }

}

module.exports = {
    buscar
}