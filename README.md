---

# Pindy Tienda Online de Ropa

## Integrantes:

- Leidy Daniela Londoño Candelo - A00392917
- Pablo Fernando Pineda Patiño - A00395831
- Juan Sebastián Libreros - A00379813
- Isabella Huila Cerón - A00394751

## Descripción del proyecto

Este proyecto se centra en la creación de una tienda virtual llamada Pindy para una empresa local. La plataforma habilita a los administradores para añadir productos al inventario, y a los clientes para adquirirlos. Asimismo, se genera una factura por cada compra realizada. La gestión de datos es temporal, sin garantía de persistencia.

## Roles de usuarios y funcionalidades

Cabe recalcar que los dos tipos de usuarios que tenemos para la aplicación tienen las mismas funcionalidades, pero a diferencia del Cliente, el Administrador puede agregar productos al inventario de la tienda online.

### Administrador

- Iniciar Sesión
- Agregar nuevos productos al inventario especificando nombre, descripción, precio y cantidad disponible del producto.

### Clientes

- Registrarse si anteriormente no habían creado una cuenta
- Iniciar sesión
- Elegir algo de la lista de productos dentro de la tienda.
- Agregar los productos al carrito de compra.
- Realizar la compra.
- Obtener una factura de compra
- Ver Historial de compras

## Usuarios y Contraseñas

Dentro de nuestra página ya existen usuarios, a continuación se muestran los usuarios y sus respectivas contraseñas:

#### Administrador

- Usuario: admin
- Contraseña: adminpass

#### Cliente

- Usuario: client
- Contraseña: clientpass

## Tecnologías Utilizadas

- Node.js: Entorno de ejecución para JavaScript
- HTML, CSS y JavaScript: Para desarrollar la interfaz de usuario

## Ejecución de la Aplicación

Para correr el programa se deberá usar el siguiente comando:

```sh
npm run start
```

Ahora abre el navegador de tu preferencia e ingresa aquí: [http://127.0.0.1:3000](http://127.0.0.1:3000)

Podrás ingresar con las credenciales que se mencionaron anteriormente de Administrador y Cliente, de lo contrario podrás crear un usuario con rol de Cliente para ingresar a la plataforma.

---

