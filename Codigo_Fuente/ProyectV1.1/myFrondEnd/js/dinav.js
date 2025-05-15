const userRole = localStorage.getItem('userRole') || 'default';

function getHeaderPath(role) {
    switch (role) {
        case 'Admin':
            return '../partials/headerAdmin.html';
        case 'Student':
            return '../partials/headerUser.html';
        case 'default':
            return '../partials/header.html'; 
    }
}


function loadMenu(role) {
    const headerPath = getHeaderPath(role);
    loadHTML('header', headerPath, () => {
        setupHamburgerMenu(); 
    });
}
function loadHTML(elementId, filePath, callback) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) throw new Error(`Error al cargar ${filePath}`);
            return response.text();
        })
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            if (callback) callback(); 
        })
        .catch(error => console.error('Error loading HTML:', error));
}

function setupHamburgerMenu() {
    const hamburger = document.getElementById("hamburger");
    const navbar = document.getElementById("navbar");

    if (hamburger && navbar) {
        hamburger.addEventListener("click", () => {
            navbar.classList.toggle("active"); 
        });
    }
}

window.addEventListener('load', () => {
    const role = localStorage.getItem('userRole') || 'default'; 
    loadMenu(role); 
});


loadHTML('footer', '../partials/footer.html');

window.addEventListener('load', () => {
    const footer = document.getElementById('footer');
    const body = document.body;

    function adjustFooterPosition() {
        if (body.scrollHeight <= window.innerHeight) {
            footer.style.position = 'absolute';
            footer.style.bottom = '0';
            footer.style.width = '100%';
        } else {
            footer.style.position = 'static';
        }
    }

    adjustFooterPosition();
    window.addEventListener('resize', adjustFooterPosition);
});