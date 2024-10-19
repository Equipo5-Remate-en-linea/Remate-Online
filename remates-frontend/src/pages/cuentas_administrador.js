import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import '../assets/cuenta_administrador.css';



function Cuentas_administrador() {
    const [usuarios, setUsuarios] = useState([]);

    const fetchUsuarios = async () => {
        try {
          const response = await fetch('http://localhost:5000/all_usuarios',{           
            method: 'GET',
            credentials: 'include'}); // Asegúrate de usar la URL correcta
          const data = await response.json();
          setUsuarios(data);
          console.log(data);
        } catch (error) {
          console.error('Error al obtener los usuarios:', error);
        }
      };

      useEffect(() => {
        fetchUsuarios();
      }, []);

    //   const CambiarEstadoAdministrador = (usuario) => {
    //     usuario.administrador? usuario.administrador = false:usuario.administrador = true;
    //     // Aquí puedes realizar otras acciones, como navegar a una página de detalles
    //   };

      const CambiarEstadoAdministrador = async (usuarioinfo) => {
        // Actualizamos la lista de usuarios cambiando el estado de administrador del usuario seleccionado
        const nuevosUsuarios = usuarios.map((usuario) => {
          if (usuario._id === usuarioinfo._id) {
            return { ...usuario, administrador: !usuario.administrador }; // Cambia el estado
          }
          return usuario;
        });
        setUsuarios(nuevosUsuarios); // Actualizamos el estado con la nueva lista

        try {
            const response = await fetch(`http://localhost:5000/actualizar_usuario/${usuarioinfo._id}`, {
              method: 'PUT',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                administrador: !nuevosUsuarios.find(usuario => usuario._id === usuarioinfo._id).administrador // Enviamos el nuevo estado
              }),
            });
        
            if (!response.ok) {
              throw new Error('Error al actualizar el usuario');
            }

          } catch (error) {
            console.error('Error al actualizar el usuario en el backend:', error);
            // Puedes revertir el cambio si la actualización falla
            setUsuarios(usuarios); // Revertir al estado anterior si hay un error
          }
      };
    
    return (
      <div className="table-container">
      <Table striped bordered hover>
        <thead>
          <tr>
           <th>#</th>
           <th>Email</th>
           <th>Administrador</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length > 0 ? (
            usuarios.map((usuario, index) => (
              <tr key={usuario._id}
              onClick={() => CambiarEstadoAdministrador(usuario)} // Hacemos la fila clickeable
              style={{ cursor: 'pointer' }} >
                <td>{index + 1}</td>
                <td>{usuario.email}</td>
                <td>{usuario.administrador ? 'Sí' : 'No'}</td>
              </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4">No hay usuarios disponibles</td>
          </tr>
        )}
      </tbody>
    </Table>
      </div>
    );
}

export default Cuentas_administrador;