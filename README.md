# Prueba - Acceso a datos en aplicaciones Node

## Descripción
El Banco Solar acaba de decidir invertir una importante suma de dinero para contratar un
equipo de desarrolladores Full Stack que desarrollen un nuevo sistema de transferencias, y
han anunciado que todo aquel que postule al cargo debe realizar un servidor con Node que
utilice PostgreSQL para la gestión y persistencia de datos, y simular un sistema de
transferencias.
El sistema debe permitir registrar nuevos usuarios con un balance inicial y basados en estos,
realizar transferencias de saldos entre ellos.
En esta prueba contarás con una aplicación cliente preparada para consumir las rutas que
deberás crear en el servidor. A continuación se muestra una imagen con la interfaz
mencionada.

## Requerimientos
1. Utilizar el paquete pg para conectarse a PostgreSQL y realizar consultas DML para la
gestión y persistencia de datos. (3 Puntos)
2. Usar transacciones SQL para realizar el registro de las transferencias. (2 Puntos)
3. Servir una API RESTful en el servidor con los datos de los usuarios almacenados en
PostgreSQL. (3 Puntos)
4. Capturar los posibles errores que puedan ocurrir a través de bloques catch o
parámetros de funciones callbacks para condicionar las funciones del servidor. (1
Punto)
5. Devolver correctamente los códigos de estado según las diferentes situaciones. (1
Punto)

## Instalación 🔧
1. Clona este repositorio.
2. Instala las dependencias por la terminal con npm:
- npm install
3. Configura las variables de entorno creando un archivo .env en la raíz del proyecto:
- DB_PASSWORD=TuContraseña
- DB_USER=TuUsuario
- DB_DATABASE=NombreDeTuBaseDeDatos
- DB_HOST=TuHost
- DB_PORT=TuPuerto
4. Inicia el servidor por la terminal:
- nodemon server

## Funcionalidades
- Agregar un nuevo usuario a la base de datos.
- Ver todos los usuarios almacenados.
- Editar un usuario existente.
- Eliminar un usuario de la base de datos.
- Realizar una transferencia con transacciones
- Ver todas las transferencias almacenadas

## Tecnologías Utilizadas
- Node.js
- Express
- PostgreSQL

## Autor
- Danicsa Calderón - [GitHub](https://github.com/DaniCalderonM)
  
![8e49375f12297ac54aca4d7d82a6935f](https://github.com/DaniCalderonM/Prueba-BancoSolar/assets/128839529/3a97a8a2-cb77-423b-b02b-8a189f8ec545)

