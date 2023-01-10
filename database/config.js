const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.MONGO_CNN, {
            //useNewUrlParser: true,
           // useUnifiedTopology: true
           //useCreateIndex: true,
           // useFindAndModify: false
        });

        console.log('La Base de datos esta en On Line');
        
    } catch (error) {
        console.log('Espinoza Robles: ' + error.message);
        throw new Error('Error al iniciar la Base de Datos: ' + error.message);
        
    }

}

//para exportar las funciones diversas
module.exports = {
    dbConnection
}
