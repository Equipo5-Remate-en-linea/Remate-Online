# Alcances de la herramienta

Este proyecto involucra el desarrollo de una plataforma de remates en línea utilizando las siguientes herramientas:

- **React (Front-end)**: Para la creación de la interfaz de usuario interactiva.
- **NodeJS (Back-end)**: Para la lógica del servidor y manejo de solicitudes HTTP.
- **MongoDB**: Base de datos NoSQL para el almacenamiento de información sobre productos y usuarios.
- **Puppeteer**: Para la automatización de pruebas y generación de capturas de pantalla de la aplicación.

# Descripción del trabajo realizado

Se desarrolló una aplicación de remates en línea que permite a los usuarios navegar por un catálogo de productos, hacer ofertas en tiempo real y recibir notificaciones sobre los resultados. Se notifica a traves de correo y todavia falta implementar la oferta en tiempo
real. El sistema está compuesto por un front-end con React, un back-end basado en NodeJS, y utiliza MongoDB para gestionar los datos de usuarios y productos.

# Dependencias entre la herramienta y la aplicación

- **React** depende de **NodeJS** para servir la aplicación y manejar las solicitudes de datos (productos, usuarios, etc.).
- **NodeJS** interactúa con **MongoDB** para almacenar y recuperar información relacionada con los productos en remate y los usuarios.
- **Puppeteer** se utiliza para ejecutar pruebas automatizadas, mas especificamente pruebas de sistemas, para verificar el correcto funcionamiento de la aplicación. Se almaceno resultado en un txt
- **Jenkins** se utiliza para supervisar el proceso de integración continua de la aplicación. Esta ligado a slack para notificar el estado y a jira para ligar tareas.

## Procedimiento de ejecución de pruebas

1. Ejecutar el servidor de NodeJS.
2. Iniciar la aplicación React en el navegador.
3. Ejecutar los scripts de pruebas con Puppeteer para validar la interacción de usuario y la correcta visualización de los datos.
4. Revisar los resultados de las pruebas en los archivos txt.

# Pruebas y resultados

Se realizaron pruebas unitarias al realizar la aplicación y de sistemas para asegurar el correcto funcionamiento del sistema. A continuacion se detalla, las entradas, salida esperada, salida obtenida, estado de la prueba y comentarios obtenidos.

- prueba_agregar_producto

Entrada: 
Email - String: sebastian.castrod@usm.cl
Contrasena - String: 123456
nombre_producto - String: producto de prueba
descripcion_producto - String: descripcion de prueba
imagen_producto - String: caja.jpg
precioInicial - String: 1000
categoria_producto - String: tecnologia

Resultado esperado: Producto agregado exitosamente
Resultado obtenido: Producto agregado exitosamente
Fallo o Éxito: Exito
Comentarios adiconales: Mayor retroalimentación en prueba.

- prueba_cuentas_administrador

Entrada: 
Email - String: sebastian.castrod@usm.cl
Contrasena - String: 123456
usuario - String: usuario_6

Resultado esperado: Cambio estado usuario
Resultado obtenido: Cambio estado usuario
Fallo o Éxito: Exito
Comentarios adiconales: Mayor retroalimentación en prueba.

- prueba_eliminar_producto

Entrada: 
Email - String: sebastian.castrod@usm.cl
Contrasena - String: 123456
producto_eliminar - String: producto_de_prueba_eliminar

Resultado esperado: Producto eliminado exitosamente
Resultado obtenido: Producto eliminado exitosamente
Fallo o Éxito: Exito
Comentarios adiconales: Mayor retroalimentación en prueba.

- prueba_filtrar_fecha

Entrada: 
Email - String: sebastian.castrod@usm.cl
Contrasena - String: 123456
filtro_fecha - String: mas-reciente

Resultado esperado: Filtro aplicado correctamente
Resultado obtenido: Filtro aplicado correctamente
Fallo o Éxito: Exito
Comentarios adiconales: Mayor retroalimentación en prueba y mejora en verificación de exito.
                        Cambio de logica entre pagina de categoria y productos, estan como una sola, lo que impide retroceder correctamente.

- prueba_filtrar_nombre

Entrada: 
Email - String: sebastian.castrod@usm.cl
Contrasena - String: 123456
filtro_nombre - String: S

Resultado esperado: Filtro aplicado correctamente
Resultado obtenido: Filtro aplicado correctamente
Fallo o Éxito: Exito
Comentarios adiconales: Mayor retroalimentación en prueba y mejora en verificación de exito.
                        Cambio de logica entre pagina de categoria y productos, estan como una sola, lo que impide retroceder correctamente.

- prueba_filtrar_precio

Entrada: 
Email - String: sebastian.castrod@usm.cl
Contrasena - String: 123456
filtro_precio - String: menor-mayor

Resultado esperado: Filtro aplicado correctamente
Resultado obtenido: Filtro aplicado correctamente
Fallo o Éxito: Exito
Comentarios adiconales: Mayor retroalimentación en prueba y mejora en verificación de exito.
                        Cambio de logica entre pagina de categoria y productos, estan como una sola, lo que impide retroceder correctamente.

- prueba_inicio_exito

Entrada: 
Email - String: sebastian.castrod@usm.cl
Contrasena - String: 123456

Resultado esperado: El formulario se envió correctamente
Resultado obtenido: El formulario se envió correctamente
Fallo o Éxito: Exito
Comentarios adiconales: Mayor retroalimentación en prueba.

- prueba_registro_fallo

Entrada: 
Email - String: sebastian.castrod@usm.cl
Contrasena - String: 12345

Resultado esperado: Formulario no se envio correctamente, campo invalido
Resultado obtenido: Formulario no se envio correctamente, campo invalido
Fallo o Éxito: Exito
Comentarios adiconales: Mayor retroalimentación en prueba.

- prueba_seleccionar_objeto

Entrada: 
Email - String: sebastian.castrod@usm.cl
Contrasena - String: 12345

Resultado esperado: Producto seleccionada correctamente
Resultado obtenido: Producto seleccionada correctamente
Fallo o Éxito: Exito
Comentarios adiconales: Mayor retroalimentación en prueba.

- prueba_subastar_producto

Entrada: 
Email - String: sebastian.castrod@usm.cl
Contrasena - String: 12345
producto - String: producto_de_prueba_detalles

Resultado esperado: Producto subastado correctamente
Resultado obtenido: Producto subastado correctamente
Fallo o Éxito: Exito
Comentarios adiconales: Mayor retroalimentación en prueba.

# Reporte de resultados

- Todas las pruebas de sistema fueron exitosas.
- No se detectaron problemas graves, solo el problema de diseño entre categoria y productos.

# Uso de jenkins

Para utilizar jenkins se debe acceder a la maquina virtual y ejecutar el comando "java -jar jenkins.war --enable-future-java". Al hacerlo se puede acceder al panel de control de jenkins, con la siguiente url: http://168.61.72.242:8080/ y aqui esta condigurado un pipeline con el git del proyecto 'Remate en linea' donde se puede probar, ademas esta configurado, para ejecutarse cada vez que se suba cambios a la rama 'Code-Base'.

# Problemas encontrados y soluciones

No se encontraron problemas.
