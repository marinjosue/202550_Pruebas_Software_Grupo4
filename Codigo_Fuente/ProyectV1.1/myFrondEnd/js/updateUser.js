const API_URL = 'http://ec2-3-15-222-198.us-east-2.compute.amazonaws.com:3000';

const showModal = (title, message) => {
    const modalTitle = document.getElementById('feedbackModalLabel');
    const modalBody = document.getElementById('feedbackModalBody');
    modalTitle.textContent = title;
    modalBody.textContent = message;
    const feedbackModal = new bootstrap.Modal(document.getElementById('feedbackModal'));
    feedbackModal.show();
};

const loadUserData = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/users/${id}`);
        if (response.ok) {
            const user = await response.json();
            document.getElementById('id').value = user.id;
            document.getElementById('cedula').value = user.cedula;
            document.getElementById('first_name').value = user.first_name;
            document.getElementById('last_name').value = user.last_name;
            document.getElementById('email').value = user.email;
            document.getElementById('address').value = user.address || '';
            document.getElementById('phone').value = user.phone || '';
            document.getElementById('password').value = user.password || '';
        } else {
            showModal('Error', 'Usuario no encontrado.');
        }
    } catch (error) {
        console.error('Error al cargar los datos del usuario:', error);
        showModal('Error', 'Error al cargar los datos del usuario.');
    }
};

document.getElementById('save-button').addEventListener('click', async () => {
    const form = document.getElementById('edit-user-form');
    const formData = new FormData(form);
    const fileInput = document.getElementById('profile_image');
    const file = fileInput.files[0];
    let profileImageName = 'default.png';

    if (file) {
        const cedula = document.getElementById('cedula').value;
        const renamedFile = new File([file], `${cedula}.png`, { type: file.type });
        const uploadPath = `../imgProfile/${renamedFile.name}`;
        profileImageName = renamedFile.name;
    }

    formData.set('profile_image', profileImageName);
    const userId = formData.get('id');
    const userData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`${API_URL}/api/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        if (response.ok) {
            showModal('Éxito', 'Usuario actualizado correctamente.');
            setTimeout(() => {
                window.location.href = '../viewAdmin/profile.html';
            }, 2000);
        } else {
            const error = await response.json();
            showModal('Error', error.message || 'Error al actualizar el usuario.');
        }
    } catch (error) {
        showModal('Error', 'Error al guardar los cambios.');
    }
});

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');
if (userId) {
    loadUserData(userId);
} else {
    showModal('Error', 'ID de usuario no proporcionado.');
}