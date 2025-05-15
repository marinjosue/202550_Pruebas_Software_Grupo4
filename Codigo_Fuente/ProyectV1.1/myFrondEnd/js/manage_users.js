


                document.getElementById('addUserForm').addEventListener('submit', async (event) => {
                    event.preventDefault();
                    const formData = new FormData(event.target);

                    try {
                        const response = await fetch('../controller/add_users.php', {
                            method: 'POST',
                            body: formData
                        });
                        const result = await response.json();

                        if (result.success) {
                            alert('Usuario agregado correctamente');
                            cargarUsuarios(); 
                            const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
                            modal.hide();
                        } else {
                            alert('Error al agregar usuario: ' + result.message);
                        }
                    } catch (error) {
                        console.error('Error al agregar usuario:', error);
                    }
                });

                async function cargarRolesEnFormulario() {
                    try {
                        const response = await fetch('../Controller/cargar_roles.php');
                        const roles = await response.json();

                        const roleSelect = document.getElementById('userRole');
                        roleSelect.innerHTML = '<option value="" disabled selected>Seleccione un rol</option>';
                        roles.forEach(role => {
                            roleSelect.innerHTML += `<option value="${role.id_rol}">${role.roles}</option>`;
                        });
                    } catch (error) {
                        console.error('Error cargando roles:', error);
                    }
                }

                document.addEventListener('DOMContentLoaded', () => {
                    cargarRolesEnFormulario();
                });


            document.getElementById('addRoleForm').addEventListener('submit', async (event) => {
                event.preventDefault();
                const formData = new FormData(event.target);

                try {
                    const response = await fetch('../Controller/agregar_rol.php', {
                        method: 'POST',
                        body: formData
                    });
                    const result = await response.json();

                    if (result.success) {
                        alert('Rol agregado correctamente');
                        cargarRoles(); 
                        const modal = bootstrap.Modal.getInstance(document.getElementById('addRoleModal'));
                        modal.hide();
                    } else {
                        alert('Error al agregar el rol: ' + result.message);
                    }
                } catch (error) {
                    console.error('Error al agregar rol:', error);
                }
            });





            async function cargarUsuarios() {
                try {
                    const response = await fetch('../Controller/cargar_usuarios.php');
                    const data = await response.json();

                    const usersTableBody = document.getElementById('usersBody');
                    usersTableBody.innerHTML = '';  

                    if (data.success) {
                        data.data.forEach(user => {
                            usersTableBody.innerHTML += `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.first_name} ${user.last_name}</td>
                        <td>${user.email}</td>
                        <td>${user.courses || 'Ninguno'}</td>
                        <td>${user.phone}</td>
                                                                                              <td>${user.id_rol}</td>


                        <td>
                            <button class="btn btn-warning btn-sm editUserBtn" data-id="${user.id}">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="btn btn-danger btn-sm deleteUserBtn" data-id="${user.id}">
                                <i class="fas fa-trash"></i> Eliminar
                            </button>
                        </td>
                    </tr>
                `;
                        });
                    } else {
                        alert(data.message || 'Error al cargar usuarios');
                    }
                } catch (error) {
                    console.error('Error cargando usuarios:', error);
                }
            }

            document.addEventListener('DOMContentLoaded', () => {
                cargarUsuarios();  
            });






            async function cargarRoles() {
                try {
                    const response = await fetch('../Controller/cargar_roles.php');
                    const data = await response.json();

                    const rolesTableBody = document.getElementById('rolesBody');
                    rolesTableBody.innerHTML = '';  

                    data.forEach(role => {
                        rolesTableBody.innerHTML += `
                        <tr>
                            <td>${role.id_rol}</td>
                            <td>${role.roles}</td>
                            <td>
                                <button class="btn btn-warning btn-sm editRoleBtn" data-id="${role.id_rol}" data-name="${role.roles}">
                                    <i class="fas fa-edit"></i> Editar
                                </button>
                                <button class="btn btn-danger btn-sm deleteRoleBtn" data-id="${role.id_rol}">
                                    <i class="fas fa-trash"></i> Eliminar
                                </button>
                            </td>
                        </tr>
                    `;
                    });
                } catch (error) {
                    console.error('Error cargando roles:', error);
                }
            }

            async function editarRol(event) {
                event.preventDefault();

                const formData = new FormData(document.getElementById('editRoleForm'));

                try {
                    const response = await fetch('../Controller/editar_rol.php', {
                        method: 'POST',
                        body: formData
                    });
                    const result = await response.json();

                    if (result.success) {
                        alert(result.message);  
                        cargarRoles(); 
                        const modal = new bootstrap.Modal(document.getElementById('editRoleModal'));
                        modal.hide();
                    } else {
                        alert(result.message);  
                    }
                } catch (error) {
                    console.error('Error actualizando rol:', error);
                }
            }


            document.addEventListener('DOMContentLoaded', () => {
                cargarRoles();  

                document.getElementById('editRoleForm').addEventListener('submit', editarRol);

                document.getElementById('rolesBody').addEventListener('click', function (event) {
                    if (event.target.classList.contains('editRoleBtn')) {
                        const id = event.target.getAttribute('data-id');
                        const name = event.target.getAttribute('data-name');

                        document.getElementById('editRoleId').value = id;
                        document.getElementById('editRoleName').value = name;

                        const modal = new bootstrap.Modal(document.getElementById('editRoleModal'));
                        modal.show();
                    }
                });
            });



         
            async function editarUsuario(event) {
                event.preventDefault();

                const userId = event.target.getAttribute('data-id');

             
                alert(`Editar usuario con ID: ${userId}`);

                
            }

            async function eliminarUsuario(event) {
                const userId = event.target.getAttribute('data-id');

                if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
                    try {
                        const response = await fetch('../Controller/eliminar_usuario.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ id: userId })
                        });

                        const result = await response.json();

                        if (result.success) {
                            alert('Usuario eliminado correctamente');
                            cargarUsuarios();  // Recargar la tabla de usuarios
                        } else {
                            alert('Error al eliminar el usuario: ' + result.message);
                        }
                    } catch (error) {
                        console.error('Error al eliminar usuario:', error);
                    }
                }
            }

            document.addEventListener('DOMContentLoaded', () => {
                cargarUsuarios();  // Cargar usuarios al cargar la página

                document.getElementById('usersBody').addEventListener('click', (event) => {
                    if (event.target.classList.contains('editUserBtn')) {
                        editarUsuario(event);  // Editar usuario
                    }

                    if (event.target.classList.contains('deleteUserBtn')) {
                        eliminarUsuario(event);  // Eliminar usuario
                    }
                });
            });

            async function editarUsuario(event) {
                event.preventDefault();

                const userId = event.target.getAttribute('data-id');

                window.location.href = `../Controller/editar_usuario.php?id=${userId}`;
            }







