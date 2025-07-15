// Pruebas para navegador - Sin imports/exports
// Estas pruebas funcionan perfectamente en el navegador

describe("Pruebas de JavaScript en el Navegador", function() {
    
    describe("Operaciones con Arrays", function() {
        it("debería filtrar cursos por rango de precio", function() {
            const courses = [
                { id: 1, name: "Curso Básico", price: 50 },
                { id: 2, name: "Curso Intermedio", price: 100 },
                { id: 3, name: "Curso Avanzado", price: 200 }
            ];
            
            const filterByMaxPrice = (courses, maxPrice) => {
                return courses.filter(course => course.price <= maxPrice);
            };
            
            const affordableCourses = filterByMaxPrice(courses, 100);
            
            expect(affordableCourses.length).toBe(2);
            expect(affordableCourses[0].name).toBe("Curso Básico");
            expect(affordableCourses[1].name).toBe("Curso Intermedio");
        });
        
        it("debería ordenar cursos por cantidad de inscritos", function() {
            const courses = [
                { id: 1, name: "React", enrolled: 45 },
                { id: 2, name: "Vue", enrolled: 23 },
                { id: 3, name: "Angular", enrolled: 67 }
            ];
            
            const sortByEnrollment = (courses) => {
                return [...courses].sort((a, b) => b.enrolled - a.enrolled);
            };
            
            const sorted = sortByEnrollment(courses);
            
            expect(sorted[0].name).toBe("Angular");
            expect(sorted[1].name).toBe("React");
            expect(sorted[2].name).toBe("Vue");
        });
        
        it("debería calcular el promedio de calificaciones de cursos", function() {
            const ratings = [4.5, 3.8, 4.9, 4.2, 3.9];
            
            const calculateAverage = (ratings) => {
                const sum = ratings.reduce((acc, rating) => acc + rating, 0);
                return Math.round((sum / ratings.length) * 10) / 10;
            };
            
            const average = calculateAverage(ratings);
            expect(average).toBe(4.3);
        });
    });
    
    describe("Manipulación de Cadenas", function() {
        it("debería crear slugs amigables para URLs", function() {
            const createSlug = (title) => {
                return title
                    .toLowerCase()
                    .replace(/[áàäâ]/g, 'a')
                    .replace(/[éèëê]/g, 'e')
                    .replace(/[íìïî]/g, 'i')
                    .replace(/[óòöô]/g, 'o')
                    .replace(/[úùüû]/g, 'u')
                    .replace(/ñ/g, 'n')
                    .replace(/[^a-z0-9]/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '');
            };
            
            expect(createSlug("Introducción a JavaScript")).toBe("introduccion-a-javascript");
            expect(createSlug("Diseño & Programación")).toBe("diseno-programacion");
            expect(createSlug("  Curso #1: Básico  ")).toBe("curso-1-basico");
        });
        
        it("debería formatear cantidades monetarias", function() {
            const formatCurrency = (amount, currency = 'USD') => {
                const formatted = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: currency
                }).format(amount);
                return formatted;
            };
            
            expect(formatCurrency(99.99)).toBe("$99.99");
            expect(formatCurrency(1299)).toBe("$1,299.00");
        });
        
        it("debería validar contraseñas seguras", function() {
            const isStrongPassword = (password) => {
                const minLength = password.length >= 8;
                const hasUpper = /[A-Z]/.test(password);
                const hasLower = /[a-z]/.test(password);
                const hasNumber = /\d/.test(password);
                const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
                
                return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
            };
            
            expect(isStrongPassword("Password123!")).toBeTruthy();
            expect(isStrongPassword("weakpass")).toBeFalsy();
            expect(isStrongPassword("PASSWORD123!")).toBeFalsy(); // Sin minúsculas
            expect(isStrongPassword("password123!")).toBeFalsy(); // Sin mayúsculas
        });
    });
    
    describe("Operaciones con Fechas y Horas", function() {
        it("debería formatear fechas en diferentes idiomas", function() {
            const formatDate = (date, locale = 'es-ES') => {
                return new Date(date).toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            };
            
            const testDate = '2025-07-14';
            const spanishFormat = formatDate(testDate, 'es-ES');
            const englishFormat = formatDate(testDate, 'en-US');
            
            expect(spanishFormat).toContain('julio');
            expect(englishFormat).toContain('July');
        });
        
        it("debería calcular el tiempo hasta que inicia el curso", function() {
            const timeUntilStart = (startDate) => {
                const now = new Date();
                const start = new Date(startDate);
                const diffMs = start - now;
                const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                
                if (diffDays < 0) return "El curso ya comenzó";
                if (diffDays === 0) return "El curso comienza hoy";
                if (diffDays === 1) return "El curso comienza mañana";
                return `El curso comienza en ${diffDays} días`;
            };
            
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            const futureDate = new Date(today);
            futureDate.setDate(futureDate.getDate() + 7);
            
            expect(timeUntilStart(tomorrow.toISOString())).toBe("El curso comienza mañana");
            expect(timeUntilStart(futureDate.toISOString())).toBe("El curso comienza en 7 días");
        });
    });
    
    describe("Simulación del DOM (específico del navegador)", function() {
        it("debería simular la validación de formularios", function() {
            // Simulamos un objeto form como el que tendríamos en el DOM
            const mockForm = {
                name: { value: "Curso de JavaScript", required: true },
                email: { value: "instructore@jemplo.com", required: true },
                price: { value: "99.99", required: true },
                description: { value: "Un curso completo de JavaScript", required: false }
            };
            
            const validateForm = (form) => {
                const errors = [];
                
                for (const [fieldName, field] of Object.entries(form)) {
                    if (field.required && !field.value.trim()) {
                        errors.push(`${fieldName} es requerido`);
                    }
                }
                
                // Validación específica de email
                if (form.email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value)) {
                    errors.push("Email no válido");
                }
                
                // Validación específica de precio
                if (form.price.value && (isNaN(form.price.value) || parseFloat(form.price.value) <= 0)) {
                    errors.push("Precio debe ser un número mayor a 0");
                }
                
                return errors;
            };
            
            const errors = validateForm(mockForm);
            expect(errors.length).toBe(0);
            
            // Probar con datos inválidos
            mockForm.email.value = "email-invalido";
            mockForm.price.value = "-10";
            
            const errorsInvalid = validateForm(mockForm);
            expect(errorsInvalid.length).toBe(2);
            expect(errorsInvalid).toContain("Email no válido");
            expect(errorsInvalid).toContain("Precio debe ser un número mayor a 0");
        });
        
        it("debería simular la funcionalidad de búsqueda de cursos", function() {
            const courses = [
                { id: 1, name: "JavaScript Fundamentals", category: "programming", tags: ["js", "web"] },
                { id: 2, name: "React for Beginners", category: "programming", tags: ["react", "frontend"] },
                { id: 3, name: "Graphic Design Basics", category: "design", tags: ["photoshop", "design"] },
                { id: 4, name: "Advanced JavaScript", category: "programming", tags: ["js", "advanced"] }
            ];
            
            const searchCourses = (courses, query, category = null) => {
                return courses.filter(course => {
                    const matchesQuery = course.name.toLowerCase().includes(query.toLowerCase()) ||
                                       course.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
                    const matchesCategory = !category || course.category === category;
                    
                    return matchesQuery && matchesCategory;
                });
            };
            
            // Buscar por texto
            const jsResults = searchCourses(courses, "javascript");
            expect(jsResults.length).toBe(2);
            
            // Buscar por categoría y texto
            const programmingResults = searchCourses(courses, "javascript", "programming");
            expect(programmingResults.length).toBe(2);
            
            // Buscar por tag
            const reactResults = searchCourses(courses, "react");
            expect(reactResults.length).toBe(1);
            expect(reactResults[0].name).toBe("React for Beginners");
        });
    });
    
    describe("Simulación de Local Storage", function() {
        it("debería simular el almacenamiento de preferencias de usuario", function() {
            // Simulamos localStorage para testing
            const mockStorage = {};
            
            const storageManager = {
                setItem: (key, value) => {
                    mockStorage[key] = JSON.stringify(value);
                },
                getItem: (key) => {
                    const item = mockStorage[key];
                    return item ? JSON.parse(item) : null;
                },
                removeItem: (key) => {
                    delete mockStorage[key];
                },
                clear: () => {
                    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
                }
            };
            
            const userPreferences = {
                theme: 'dark',
                language: 'es',
                autoplay: false,
                notifications: true
            };
            
            // Guardar preferencias
            storageManager.setItem('userPrefs', userPreferences);
            
            // Recuperar preferencias
            const retrieved = storageManager.getItem('userPrefs');
            expect(retrieved.theme).toBe('dark');
            expect(retrieved.language).toBe('es');
            expect(retrieved.autoplay).toBeFalsy();
            
            // Limpiar storage
            storageManager.clear();
            expect(storageManager.getItem('userPrefs')).toBeNull();
        });
    });
});
