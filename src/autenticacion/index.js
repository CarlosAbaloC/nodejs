//PAra hacer los tokens

const jwt = require("jsonwebtoken");
config = require("../config");

//Es el secreto para generar el token
const secret = config.jwt.secret;

function asignarToken(data) {
    return jwt.sign(data, secret);
}

//Con esta funcion comprobamos si el token es igual al que nos dan
function verificarToken(token) {
    return jwt.verify(token, secret);
}

//En seguridad vemos que no hemos llamado directamente a verificar token, sino a la constante de chequear token y ahi ya lo confirmamos
const chequearToken = {
    confirmarToken: function(req, id) {
        const decodificado = decodificarCabecera(req);

        //Esto solo si quieres limitar que hace cada token
        
        if(decodificado.id !== id) {
            throw new Error("No puedes hacer esto");
        }
    }
}

function obtenerToken(autorizacion) {
    //Si no envias el error sera que no viene
    if(!autorizacion) {
        throw new Error("No viene token");
    }
//Hay que dejar un espacio despues del bearer
//Si viene o no ese contenido, sino da formato invalido
    if(autorizacion.indexOf("Bearer") === -1) {
        throw new Error("Formato invalido");
    }
//Hay que dejar un espacio despues del bearer
//Este es el bueno, al que le vas a quitar la cabecera despues
    let token = autorizacion.replace("Bearer ", "")
    return token
;}

//A esta funcion la llamala const chequearToken
function decodificarCabecera(req) {
    //Aqui tenemos la autorizacion
    const autorizacion = req.headers.authorization || '';
    //Aqui le pasamos la autorizacion
    const token = obtenerToken(autorizacion);
    //Por ultimo ya lo vamos a decodificar
    const decodificado = verificarToken(token);
    //Para tener el user que va a ser decodificado
    req.user = decodificado;

    return decodificado
}

module.exports = {
    asignarToken,
    chequearToken
}