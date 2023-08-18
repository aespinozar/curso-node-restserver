const { v4: uuidv4 } = require('uuid');
const path = require('path');

const subirArchivo =(files, extencionesValida = ['png','jpg','jpeg','gif'], carpeta = '' ) => {
    
    return new Promise((resolve, reject) =>{
     //la req tiene un file y lo guardo como archivo
    const {archivo} = files;
    //esto extrae la parte de la extencion de archivo.
    const nombreCortado = archivo.name.split('.');
    const extencion = nombreCortado[nombreCortado.length - 1];

    //validar las extenciones permitidas:
    if(!extencionesValida.includes(extencion)){
        return reject(`La extencion ${extencion} no es permitida - ${extencionesValida}`);
      
     }
 
     const nombreTemp = uuidv4() + '.' + extencion;
     //llevamos  el file a una carpeta llamada uploads (esta no existe se debe crear en la rais de la app)
     //_dirname apunta al directorio actual por lo q poneneos ../uploads
      const uploadPath = path.join(__dirname , '../uploads/', carpeta, nombreTemp);
      archivo.mv(uploadPath, (err) => {
        if (err) {
            reject(err);
          
        }
        resolve(nombreTemp);
   
      });

    });
}

module.exports = {
    subirArchivo
}