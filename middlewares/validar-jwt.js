const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async(req= request, res=response,next) => {
    const token = req.header('x-token');
    if(!token){
        return res.status(401).json({
            msg: 'No existe Token en la peticion'
        });
    }
    try {
        //funcion que verifica la valides del token
       const {uid} = jwt.verify(token,process.env.SECRETORPRIVATEKEY); 
       //leer el usuario que corresponde al uid
       const usuario = await Usuario.findById(uid); 
       //verifico si el usuario no existe esta borrado.
        if(!usuario){
            return res.status(401).json({
                msg: 'El token no es valido - usuario borrado de la DB'
            })

        }
       //verificar que el usuario tiene estado en true.
       if(!usuario.estado){
        return res.status(401).json({
            msg: 'El token no es valido - usuario con estado false'
        })

       }

       req.usuario = usuario;

        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no Valido'
        })
     
    }
     
}

module.exports = {
    validarJWT
}