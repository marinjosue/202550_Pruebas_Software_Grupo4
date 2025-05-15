function handleLogout() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Deseas cerrar la sesión?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.setItem('userRole', 'default');
            localStorage.removeItem('username');
            Swal.fire({
                title: '¡Sesión cerrada!',
                text: 'Has cerrado sesión exitosamente',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                window.location.href = '../index/index.html';
            });
        }
    });
}


async function cargarPerfilUsuario() {

    // Obtener el token del localStorage
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
        window.location.href = '../views/login.html';
        return;
    }

    const API_URL = 'http://ec2-3-15-222-198.us-east-2.compute.amazonaws.com:3000';
    const response = await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });


    if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
    }

    const user = await response.json();

    // Actualizar la información en el DOM
    document.getElementById('fullName').textContent = `${user.first_name} ${user.last_name}`;
    document.getElementById('id').value = user.cedula;
    document.getElementById('email').value = user.email;
    document.getElementById('phone').value = user.phone || 'No disponible';
    document.getElementById('role').textContent = `Rol: ${user.id_rol}`;

    // Configurar la imagen del perfil
    const photo = document.getElementById('photo');
    const photoUrl = `../imgProfile/${user.cedula}.png?timestamp=${new Date().getTime()}`;
    photo.src = photoUrl;

    // Manejar errores de carga de imágenes
    photo.onerror = function () {
        console.warn('Error al cargar la imagen del usuario, cargando imagen por defecto.');
        this.src = '../imgProfile/default.png';
        this.onerror = null; // Evitar bucles
    };
    // Configurar el botón de editar perfil
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    editProfileBtn.addEventListener('click', () => {
        const queryParams = new URLSearchParams({
            id: user.id,
            cedula: user.cedula,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone || ''
        }).toString();

        // Redirigir a la página de edición de perfil con los parámetros
        window.location.href = `../views/updateUser.html?${queryParams}`;
    });
}


function handleLogout() {
    // Limpiar el localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');

    Swal.fire({
        title: 'Cerrando sesión',
        text: 'Has cerrado sesión exitosamente.',
        icon: 'success'
    }).then(() => {
        window.location.href = '../views/login.html';
    });
}

// Verificar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../views/login.html';
        return;
    }
    cargarPerfilUsuario();
});