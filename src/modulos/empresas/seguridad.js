//Para ver si es verdadero el token
const auth = require("../../autenticacion");

module.exports = function chequearAuth() {
    function middleware(req, res, next) {
        //El id solo si haces en el index de autenticacion el: if(decodificado.id !== id)
        const id = req.body.id;

        auth.chequearToken.confirmarToken(req, id);
        //auth.chequearToken.confirmarToken(req);

        //Si todo va bien
        next();

    }

    return middleware
}