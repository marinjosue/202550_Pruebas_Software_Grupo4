-- Tabla de Roles
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Usuarios
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Insertar roles de ejemplo
INSERT INTO roles (name, description) VALUES
('admin', 'Administrador del sistema'),
('user', 'Usuario estándar'),
('moderator', 'Moderador de contenido'),
('guest', 'Usuario invitado');

-- Insertar usuarios de ejemplo
INSERT INTO users (username, email, password, role_id) VALUES
('admin_user', 'admin@example.com', '$2b$10$hash1', 1),
('john_doe', 'john@example.com', '$2b$10$hash2', 2),
('jane_smith', 'jane@example.com', '$2b$10$hash3', 2),
('moderator1', 'mod@example.com', '$2b$10$hash4', 3),
('guest_user', 'guest@example.com', '$2b$10$hash5', 4);
