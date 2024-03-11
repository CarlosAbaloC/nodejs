//En DB vamos a incluir todas las bases de datos que vamos a incluir
const mysql = require("mysql");
const config = require("../config");

//Nuestro primer archivo de configuracion
const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
}

//Funcion para conectarnos a la base de datos, con los datos enviados por config.js
let conexion;
function conMysql() {
    conexion = mysql.createConnection(dbconfig);

    conexion.connect((err) => {
        if(err) {
            console.log("[db err]", err);
            //Si no conecta lo vuelve a intentar al cabo de unos segundos
            setTimeout(conMysql, 200);
        }
        else {
            console.log("BD Conectada")
        }
    })

    conexion.on("error", err => {
        console.log("[db err]", err);
        if(err.code === "PROTOCOL_CONNECTION_LOST") {
            conMysql();
        }
        else {
            //Si de verdad hay un problema devuelve el problema
            throw err;
        }
    })
}


conMysql();

//Lo que devuelvas aqui con el return sera lo que se vea

//Para traer todos los datos de la tabla
//Necesita el nombre de la tabla
function todos (tabla) {
    /*Version "compleja"
    
    return new Promise( (resolve, reject) => {
        conexion.query(`SELECT * FROM  ${tabla}`, (error, result) => {
            if(error) return reject(error);
            resolve(result);
        })
    });
    */
    //Version "simplificada"
    return new Promise( (resolve, reject) => {
        conexion.query(`SELECT * FROM  ${tabla}`, (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    });
}


//Solo trae uno
//Necesita el nombre de la tabla y el id
function uno(tabla, id) {
    /* Version "compleja"
    return new Promise( (resolve, reject) => {
        conexion.query(`SELECT * FROM  ${tabla} WHERE id=${id}`, (error, result) => {
            if(error) return reject(error);
            resolve(result);
        })
    });
     */
    //Version "simplificada"
    return new Promise( (resolve, reject) => {
        conexion.query(`SELECT * FROM  ${tabla} WHERE id=${id}`, (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    });
}
/*Version vieja, antes del auth

//Insertar datos nuevos 
function insertar(tabla, data) {
    return new Promise( (resolve, reject) => {
        conexion.query(`INSERT INTO  ${tabla} SET ?`, data, (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    });
}
//Actualizar modificar datos nuevos
function actualizar(tabla, data) {
    return new Promise( (resolve, reject) => {
        conexion.query(`UPDATE  ${tabla} SET ? WHERE id= ?`, [data, data.id], (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    });
}

//actualizacion y hacer registro, se usa el cero porque las bases de datos suelen empezar sus ids con 1
//Necesita el nombre de la tabla y datos
function agregar(tabla, data) {
    //Si hay datos, y el id es cero, quiere decir que hay que agregar un nuevo elemento, sino es actualizarlo
    if(data && data.id == 0) {
        return insertar(tabla, data);
    }
    else {
        return actualizar(tabla, data)
    }
}
*/

//Borras las dos funciones y solo dejas la de insertar, ahora llamada agregar
function agregar(tabla, data) {
    return new Promise( (resolve, reject) => {
        //El ON DUPLICATE KEY UPDATE sirve para que en caso de que ya haya uno creado con ese id lo modifique con los datos nuevos
        //El primer signo de interrogacion es data, y el segundo tambien es data, como si pusieras las variables
        conexion.query(`INSERT INTO  ${tabla} SET ? ON DUPLICATE KEY UPDATE ?`, [data,data], (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    });
}

//Borrar
//Necesita el nombre de la tabla y id
//Para borrarla con postman en body te vas a raw y ahi pones el id como en un json { "id": 1 }
function eliminar(tabla, data) {
    return new Promise( (resolve, reject) => {
        console.log(data.id);
        conexion.query(`DELETE FROM  ${tabla} WHERE id= ?`, data.id, (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    });
}

//Para autenticar
function query(tabla, consulta) {
    return new Promise( (resolve, reject) => {
        conexion.query(`SELECT * FROM ${tabla} WHERE ?`, consulta, (error, result) => {
            return error ? reject(error) : resolve(result[0]);
        })
    });
}


//Para exportar todo
module.exports = {
    todos, 
    uno, 
    agregar, 
    eliminar,
    query
}
