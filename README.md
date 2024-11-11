# Remate-Online

Aplicación web de remates en línea.

---

## Pre-requisitos

Para instalar y ejecutar la aplicación se deben tener instalado [npm](https://www.npmjs.com/) y [node](https://nodejs.org/en/).

## Instalación

Clone el repositorio.

```shell
git clone https://github.com/Equipo5-Remate-en-linea/Remate-Online.git
```

Instale las dependencias

```shell
npm install
```

Esto debe hacerse de manera individual tanto para el backend como el frontend, carpetas `remates-backend` y `remates-frontend`, respectivamente.

## Configuración

Es necesario que se cree un archivo `.env` en el backend con la variable `JWT_SECRET` (con cualquier valor) para firmar el token de sesión de usuario.

## Ejecución local

Ejecute el servidor del backend.

```shell
# ubicado en la carpeta remates-backend, ejecute
node server.js
```

Ejecute el servidor del frontend.

```shell
# ubicado en la carpeta remates-frontend, ejecute
npm run start
```

La aplicación se abrirá en su navegador.

