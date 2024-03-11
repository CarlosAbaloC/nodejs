//Para manejar los errores y asi que el usuario final no tenga que ver los mensajes complejos de error
function error (message, code) {
    let e = new Error(message);

    if(code) {
        e.statusCode = code;
    }

    return e;
}