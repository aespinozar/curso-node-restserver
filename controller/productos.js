const { response,request } = require('express');
const { Producto } = require('../models');

/* const crearProducto = async(req, res = response ) => {

const { estado, usuario, ...body } = req.body;

const productoDB = await Producto.findOne({ nombre: body.nombre });

    if ( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre }, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto( data );

    // Guardar DB
    await producto.save();

    res.status(201).json(producto);

}
 */
const crearProducto = async(req,res = response) => {
    // extrae el nombre del body de la request y lo combierte a mayusculas.
    const nombre = req.body.nombre.toUpperCase();
    //verifica que no exista otro producto con el mismo nombre
    const productoDB = await Producto.findOne({nombre})
    if (productoDB) {
        return res.status(400).json({
            msg: `El Producto ${productoDB.nombre}, ya existe`
        });
    }

    // generar la data a grabar. el usuario lo lee del token q
    // viene en la request
    const data ={
        nombre,
        usuario: req.usuario._id,
        precio : req.body.precio,
        categoria: req.body.categoria,
        descripcion : req.body.descripcion
    }

    const producto = new Producto(data);
    //Para guardar en la BD
    await producto.save();
    res.status(201).json(producto);
}

// Obtener Productos - paginado - con totales al pie- tener un objeto populate.
// este populate es una opcion de mongo que relaciona el idusuario con el nombre usuario y la categoria
const productoGet = async(req = request, res = response) => {
    // const {q,nombre = 'no envia',apikey} = req.query;
    const {limite=5, desde = 0} = req.query; // indicamos que vamos ha recibir un parametro: limite,con volor por defecto 5
    const query = {estado:true};
    const [total,productos] = await Promise.all([
         Producto.countDocuments(query), //retorna total
         Producto.find(query)
           .populate('usuario','nombre')
           .populate('categoria','nombre')
           .skip(Number(desde))
           .limit(Number(limite))
    ]);
    res.json({
         total,
         productos
     });
}

// Obtener Categoria por id - tener un objeto populate. trae una categoria valida.
const productoGetId = async(req = request, res=response) => {
    const query = {estado:true};
    const {id} = req.params;
    const producto = await Producto.findById(id)
          .populate('usuario','nombre')
          .populate('categoria','nombre');
    
    res.json({
        producto
     });
}

// Actualizar Producto 
const productoPut = async(req, res= response) => {
    const {id } = req.params; // params puede traer muchos datos.
    //excluyo estado, usuario porque no se actualizara. lo demas lo almaceno en data
    const {estado,usuario, ...data} = req.body;
    // el nombre que sera actualizado lo convierto a mayuscula
    if(data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }
    
    // actualizamos el usuario que realizo el cambio.
    data.usuario = req.usuario._id;
    const producto = await Producto.findByIdAndUpdate(id,data,{new: true});
    res.json({
       producto
    });
}

// Borrar Categoria - cambiar estado a false - solo Admin.

const productoDelete = async(req, res = response) => {
    const {id} = req.params;
    //borrado fisico.
    //const categoria = await Categoria.findByIdAndDelete(id);
    //borrado logico:
    const producto = await Producto.findByIdAndUpdate(id, {estado:false},{new: true});
    res.json({
       producto
    });
}

module.exports = {
    crearProducto,
    productoGet,
    productoGetId,
    productoPut,
    productoDelete
}

