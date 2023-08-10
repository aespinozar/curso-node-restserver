const { response, request } = require("express");
const {Categoria} = require('../models');
const bcryptjs = require('bcryptjs');

// Obtener Categorias - paginado - con totales al pie- tener un objeto populate.
// este populate es una opcion de mongo que relaciona el idusuario con el nombre usuario
const categoriaGet = async(req = request, res = response) => {
    // const {q,nombre = 'no envia',apikey} = req.query;
    const {limite=5, desde = 0} = req.query; // indicamos que vamos ha recibir un parametro: limite,con volor por defecto 5
    const query = {estado:true};
    const [total,categorias] = await Promise.all([
         Categoria.countDocuments(query), //retorna total
         Categoria.find(query).populate('usuario','nombre') //retorna las categorias y el nombre del usuario
         .skip(Number(desde))
         .limit(Number(limite))
    ]);
    res.json({
         total,
         categorias
     });
}

// Obtener Categoria por id - tener un objeto populate. trae una categoria valida.
const categoriaGetId = async(req = request, res=response) => {
    const query = {estado:true};
    const {id} = req.params;
    const categoria = await Categoria.findById(id).populate('usuario','nombre');
    
    res.json({
        categoria
     });
}

const crearCategoria = async(req,res = response) => {
    // extrae el nombre del body de la request y lo combierte a mayusculas.
    const nombre = req.body.nombre.toUpperCase();
    //verifica que no exista otra categoria con el mismo nombre
    const categoriaDB = await Categoria.findOne({nombre})
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        });
    }

    // generar la data a grabar. el usuario lo lee del token q
    // viene en la request
    const data ={
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);
    //Para guardar en la BD

    await categoria.save();
    res.status(201).json(categoria);

}

// Actualizar Categoria 
const categoriaPut = async(req, res= response) => {
    const {id } = req.params; // params puede traer muchos datos.
    //excluyo estado, usuario porque no se actualizara. lo demas lo almaceno en data
    const {estado,usuario, ...data} = req.body;
    // el nombre que sera actualizado lo convierto a mayuscula
    data.nombre = data.nombre.toUpperCase();
    // actualizamos el usuario que realizo el cambio.
    data.usuario = req.usuario._id;
    const categoria = await Categoria.findByIdAndUpdate(id,data,{new: true});
    res.json({
       categoria
    });
}

// Borrar Categoria - cambiar estado a false - solo Admin.
const categoriaDelete = async(req, res = response) => {
    const {id} = req.params;
    //borrado fisico.
    //const categoria = await Categoria.findByIdAndDelete(id);
    //borrado logico:
    const categoria = await Categoria.findByIdAndUpdate(id, {estado:false},{new: true});
    //obtener al usuario autenticado
    //const usuarioAutenticado = req.usuario;// aqui debe obtener los datos del usuario ojo tengo uid.

    //imprimir el usuario (borrado) y el autenticado
    res.json({
       categoria
    });
}

module.exports = {
    crearCategoria,
    categoriaGet,
    categoriaGetId,
    categoriaPut,
    categoriaDelete
    
}