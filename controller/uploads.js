const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);
const { response } = require('express');
const { subirArchivo } = require('../helpers');
const {Usuario,Producto} = require('../models');

const cargarArchivo = async(req, res=response)=> {
    
    try {
        //se pone como permitidos a txt, md
        //const nombre = await subirArchivo(req.files,['txt', 'md'], 'textos');
        const nombre = await subirArchivo(req.files,undefined, 'imgs');
        res.json({ nombre  });
    } catch (error) {
        res.status(400).json({error});
    }
}
//funcion para actualizar.
const actualizarImagen = async(req, res=response) => {
    const {id, coleccion} = req.params;
    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un Usuario con el Id ${id}`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un Producto con el Id ${id}`
                });
            }
            break;  
                
        default:
            return res.status(500).json({msg: 'Se me olvido validar esto'});
           
    }  
    // hace la limpieza previa del archivo en la carpeta:
    if(modelo.img){
        // hay que borrar la imagen del servidor
        const pathImagen= path.join(__dirname,'../uploads', coleccion,modelo.img);
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
    }
    //para subir imagen de usuario o producto ya se valido.
    //req.file=arch.img, undefined = tipo permitido, coleccion=carpeta donde sube.
    const nombre = await subirArchivo(req.files,undefined, coleccion);
    modelo.img= nombre;
    await modelo.save();
    
    res.json(modelo);

}

const actualizarImagenCloudinary = async(req, res=response) => {
    const {id, coleccion} = req.params;
    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un Usuario con el Id ${id}`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un Producto con el Id ${id}`
                });
            }
            break;  
                
        default:
            return res.status(500).json({msg: 'Se me olvido validar esto'});
           
    }  
    // hace la limpieza previa del archivo en cloudinary:
    if(modelo.img){
        // hay que borrar la imagen del servidor cloudinary.
        //separa como arreglo la url donde esta la imagen
        const nombreArr = modelo.img.split('/');
        //obtiene la ultima posicion del arreglo donde esta la imagen: idimagen.jpg
        const nombre = nombreArr[nombreArr.length -1];
        //obtenemos la primera posicion donde esta idImagen
        const [public_id] = nombre.split('.');
        //borramos del cloudinari la imagen con ese id.
        cloudinary.uploader.destroy(public_id);
       
    }
    //para subir imagen de usuario o producto ya se valido. a clodinary
    //en req.file existe un carpeta temporal donde se gurda el archivo. Esta carpeta se llamatempFilePath
    // extraemos esta ruta y luego con upload() so subimos s clodinary
    const {tempFilePath} = req.files.archivo;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
    modelo.img= secure_url;
    await modelo.save(); //lo guarda en DB
    res.json(modelo);
}

const mostrarImagen= async(req,res=response)=> {
    const {id, coleccion} = req.params;
    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un Usuario con el Id ${id}`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un Producto con el Id ${id}`
                });
            }
            break;  
                
        default:
            return res.status(500).json({msg: 'Se me olvido validar esto'});
           
    }  
    // hace la limpieza previa del archivo en la carpeta:
    if(modelo.img){
        const pathImagen= path.join(__dirname,'../uploads', coleccion,modelo.img);
        if(fs.existsSync(pathImagen)){
            //si existe la img en la ruta retorna la imagen
            return res.sendFile(pathImagen)
        }
    }
    // aqui se debe construir la ruta de la inmagen place holder.
    const pathImagenPc= path.join(__dirname,'../assets/no-image.jpg');
    res.sendFile(pathImagenPc);
    //res.json({msg: 'Falta place holder'});
}
module.exports ={
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}