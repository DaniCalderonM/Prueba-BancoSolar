const manejoErrores = (error, pool, tabla) => {
    let mensaje;
    switch (error.code) {
        case '28P01':
            mensaje = "Error, autenticación de contraseña falló o no existe el usuario: " + pool.options.user;
            break;
        case '23505':
            mensaje = "Error, no se puede agregar nuevamente al estudiante. " + error.detail;
            break;
        case '42P01':
            mensaje = "Error, no existe la tabla consultada [" + tabla + "]";
            break;
        case '22P02':
            mensaje = "Error, la sintaxis de entrada no es válida para tipo integer";
            break;
        case '3D000':
            mensaje = "Error, la Base de Datos [" + pool.options.database + "] no existe";
            break;
        case '28000':
            mensaje = "Error, el usuario/rol [" + pool.options.user + "] no existe";
            break;
        case '42601':
            mensaje = "Error de sintaxis en la instrucción SQL --> " + error.message;
            break;
        case '42703':
            mensaje = "Error, no existe la columna consultada: " + error.hint;
            break;
        case 'ENOTFOUND':
            mensaje = "Error en el valor usado como localhost: " + pool.options.host;
            break;
        case 'ECONNREFUSED':
            mensaje = "Error en el puerto de conexión a BD, usando: " + pool.options.port;
            break;
        default:
            mensaje = "Default: " + error;
            break;
    }
    console.log(mensaje);
    return mensaje
};

export { manejoErrores };