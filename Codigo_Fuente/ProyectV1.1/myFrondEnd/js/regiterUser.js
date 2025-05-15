document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('registerForm');
    const isGoogleAuth = new URLSearchParams(window.location.search).get('source') === 'google';

    if (isGoogleAuth) {
        const googleData = JSON.parse(localStorage.getItem('googleData') || '{}');
        if (googleData.email) {
            document.getElementById('email').value = googleData.email;
            document.getElementById('first_name').value = googleData.first_name || '';
            document.getElementById('last_name').value = googleData.last_name || '';
            document.getElementById('email').readOnly = true;

            // Añadir campo oculto para google_id
            const googleIdInput = document.createElement('input');
            googleIdInput.type = 'hidden';
            googleIdInput.name = 'google_id';
            googleIdInput.value = googleData.google_id;
            registerForm.appendChild(googleIdInput);
        } else {
            console.warn('No se encontraron datos de Google en localStorage.');
        }
    }
});

// Manejar envío del formulario
registerForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    // Obtener los datos del formulario
    const formData = new FormData(this);
    const userData = Object.fromEntries(formData.entries());

    // Validaciones básicas
    if (!userData.cedula || !/^\d{10}$/.test(userData.cedula)) {
        Swal.fire({
            title: 'Error',
            text: 'La cédula debe contener exactamente 10 dígitos.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    if (!userData.first_name || userData.first_name.length < 2) {
        Swal.fire({
            title: 'Error',
            text: 'El nombre debe tener al menos 2 caracteres.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    if (!userData.last_name || userData.last_name.length < 2) {
        Swal.fire({
            title: 'Error',
            text: 'El apellido debe tener al menos 2 caracteres.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    if (!userData.email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(userData.email)) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, ingresa un correo electrónico válido.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    if (!userData.password || userData.password.length < 6) {
        Swal.fire({
            title: 'Error',
            text: 'La contraseña debe tener al menos 6 caracteres.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    if (!userData.gender) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor selecciona un género.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    // Si el usuario proviene de Google, agrega `google_id` al cuerpo de la solicitud
    const isGoogleAuth = new URLSearchParams(window.location.search).get('source') === 'google';
    if (isGoogleAuth) {
        const googleData = JSON.parse(localStorage.getItem('googleData') || '{}');
        if (googleData.google_id) {
            userData.google_id = googleData.google_id;
        }
    }

    try {
        const API_URL = 'http://ec2-3-15-222-198.us-east-2.compute.amazonaws.com:3000';
        const response = await fetch(`${API_URL}/api/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (response.ok) {
            // Registro exitoso
            Swal.fire({
                title: '¡Registro exitoso!',
                text: 'Serás redirigido al inicio de sesión.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });

            // Redirigir al inicio de sesión
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            // Error en el servidor
            Swal.fire({
                title: 'Error',
                text: data.message || 'Hubo un error al intentar registrar el usuario.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {
        // Error en la conexión o servidor
        Swal.fire({
            title: 'Error',
            text: 'No se pudo conectar con el servidor. Por favor, intenta nuevamente.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});