//La tabla en la que se pondran las contraseñas
const TABLA = "auth";

//Variable del token secreto
const auth = require("../../autenticacion");

//Requerimos el encriptador instalado
const bcrypt = require("bcrypt");

module.exports = function(dbInyectada) { 

    let db = dbInyectada;

    if(!db) {
        db = require("../../DB/mysql")
    }

    async function login(usuario, password) {
        const data = await db.query(TABLA, {usuario: usuario});

        return bcrypt.compare(password, data.password)
            .then(resultado => {
                if(resultado === true) {
                    //Generar un token
                    return auth.asignarToken({ ...data});
                } else {
                    //Se envia como mensaje informacion invalida para que no puedas ver datos del servidor
                    throw new Error("Informacion invalida");
                }
            })
    }


    //Async solo cuando hacemos el encriptado, sino no hace falta
    async function agregar(data) {

        //Datos de autenticacion, donde metemos el id que es del usuario
        const authData = {
            id: data.id,
        }
        
        if(data.usuario) {
            authData.usuario = data.usuario
        }

        /*Asi se envian las contraseñas sin encriptar
        if(data.password) {
            authData.password = data.password
        }
        */

        if(data.password) {
            //Lo convierte en string y lo encripta, el cinco es el numero de veces que lo hace, 
            //puede ser las que quieras, cuanto mas lo hagas mas seguro sera, pero llevara mas tiempo
            authData.password = await bcrypt.hash(data.password.toString(), 5);
        }

        return db.agregar(TABLA, authData);
    }

    return {
        agregar,
        login
    }

}
