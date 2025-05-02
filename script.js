// 1. Constructor para Libros
function Libro(id, titulo, autor, año) {
    this.id = id;
    this.titulo = titulo;
    this.autor = autor;
    this.año = año;
    this.disponible = true;
    
    this.prestar = function() {
        this.disponible = false;
    };
    
    this.devolver = function() {
        this.disponible = true;
    };
    
    this.getInfoLibro = function() {
        return `${this.titulo} (${this.autor}, ${this.año})`;
    };
}

// 2. Constructor para Usuarios
function Usuario(id, nombre, email) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.librosPrestados = 0;
    
    this.prestarLibro = function() {
        this.librosPrestados++;
    };
    
    this.devolverLibro = function() {
        if (this.librosPrestados > 0) {
            this.librosPrestados--;
        }
    };
    
    this.tienePrestamos = function() {
        return this.librosPrestados > 0;
    };
}

// 3. Constructor para Préstamos
function Prestamo(id, libroId, usuarioId, fechaPrestamo) {
    this.id = id;
    this.libroId = libroId;
    this.usuarioId = usuarioId;
    this.fechaPrestamo = fechaPrestamo;
    this.fechaDevolucion = null;
    this.estado = "Prestado";
    
    this.devolver = function() {
        this.fechaDevolucion = new Date().toISOString();
        this.estado = "Devuelto";
    };
}

// Base de datos
const biblioteca = {
    libros: [],
    usuarios: [],
    prestamos: [],
    nextLibroId: 1,
    nextUsuarioId: 1,
    nextPrestamoId: 1,
    
    // Métodos para agregar elementos
    agregarLibro: function(titulo, autor, año) {
        const libro = new Libro(this.nextLibroId++, titulo, autor, año);
        this.libros.push(libro);
        return libro;
    },
    
    agregarUsuario: function(nombre, email) {
        const usuario = new Usuario(this.nextUsuarioId++, nombre, email);
        this.usuarios.push(usuario);
        return usuario;
    },
    
    prestarLibro: function(libroId, usuarioId) {
        const libro = this.libros.find(l => l.id === libroId);
        const usuario = this.usuarios.find(u => u.id === usuarioId);
        
        if (libro && libro.disponible && usuario) {
            libro.prestar();
            usuario.prestarLibro();
            
            const prestamo = new Prestamo(
                this.nextPrestamoId++,
                libroId,
                usuarioId,
                new Date().toISOString()
            );
            
            this.prestamos.push(prestamo);
            return prestamo;
        }
        return null;
    },
    
    devolverLibro: function(prestamoId) {
        const prestamo = this.prestamos.find(p => p.id === prestamoId && p.estado === "Prestado");
        
        if (prestamo) {
            const libro = this.libros.find(l => l.id === prestamo.libroId);
            const usuario = this.usuarios.find(u => u.id === prestamo.usuarioId);
            
            libro.devolver();
            usuario.devolverLibro();
            prestamo.devolver();
            
            return true;
        }
        return false;
    }
};

// Función para inicializar datos de ejemplo
function init() {
    // Agregar libros de ejemplo
    biblioteca.agregarLibro("Cien años de soledad", "Gabriel García Márquez", 1967);
    biblioteca.agregarLibro("1984", "George Orwell", 1949);
    biblioteca.agregarLibro("El Principito", "Antoine de Saint-Exupéry", 1943);
    biblioteca.agregarLibro("Don Quijote", "Miguel de Cervantes", 1605);
    biblioteca.agregarLibro("Orgullo y prejuicio", "Jane Austen", 1813);
    
    // Agregar usuarios de ejemplo
    biblioteca.agregarUsuario("Ana López", "ana@email.com");
    biblioteca.agregarUsuario("Carlos Ruiz", "carlos@email.com");
    
    // Realizar algunos préstamos
    biblioteca.prestarLibro(1, 1);
    biblioteca.prestarLibro(2, 2);
    biblioteca.prestarLibro(5, 1);
    
    // Renderizar datos
    renderLibros();
    renderUsuarios();
    renderPrestamos();
}

// Funciones para renderizar las tablas (debes implementarlas)
function renderLibros() {
    // Implementa la lógica para mostrar los libros en la tabla
    const tablaBody = document.querySelector("#tablaLibros tbody");
    tablaBody.innerHTML = "";
    
    biblioteca.libros.forEach(libro => {
        const fila = document.createElement("tr");
        
        const celdaId = document.createElement("td");
        celdaId.textContent = libro.id;
        
        const celdaTitulo = document.createElement("td");
        celdaTitulo.textContent = libro.titulo;
        
        const celdaAutor = document.createElement("td");
        celdaAutor.textContent = libro.autor;
        
        const celdaAño = document.createElement("td");
        celdaAño.textContent = libro.año;
        
        const celdaDisponible = document.createElement("td");
        if (libro.disponible) {
            celdaDisponible.innerHTML = '<span class="disponible-si">✓ Sí</span>';
        } else {
            celdaDisponible.innerHTML = '<span class="disponible-no">✗ No</span>';
        }
        
        const celdaAcciones = document.createElement("td");
        
        if (!libro.disponible) {
            celdaAcciones.textContent = "No disponible";
        } else {
            const botonEliminar = document.createElement("button");
            botonEliminar.textContent = "Eliminar";
            botonEliminar.onclick = function() {
                eliminarLibro(libro.id);
            };
            botonEliminar.style.backgroundColor = "#dc3545";
            botonEliminar.style.color = "white";
            
            celdaAcciones.appendChild(botonEliminar);
        }
        
        fila.appendChild(celdaId);
        fila.appendChild(celdaTitulo);
        fila.appendChild(celdaAutor);
        fila.appendChild(celdaAño);
        fila.appendChild(celdaDisponible);
        fila.appendChild(celdaAcciones);
        
        tablaBody.appendChild(fila);
    });
    
    if (!document.getElementById("formNuevoLibro")) {
        const divLibros = document.getElementById("libros");
        
        // Crear el botón de agregar libro que estará en la parte superior
        const botonAgregar = document.createElement("button");
        botonAgregar.textContent = "Agregar Libro";
        botonAgregar.id = "botonAgregarLibro";
        botonAgregar.style.marginBottom = "10px";
        botonAgregar.style.padding = "8px 16px";
        botonAgregar.style.backgroundColor = "#4CAF50";
        botonAgregar.style.color = "white";
        botonAgregar.style.fontWeight = "bold";
        botonAgregar.style.border = "none";
        botonAgregar.style.borderRadius = "4px";
        botonAgregar.style.cursor = "pointer";
        
        // Crear el formulario que aparecerá al hacer clic en el botón
        const form = document.createElement("div");
        form.id = "formNuevoLibro";
        form.className = "form-group";
        form.style.display = "none"; // Oculto por defecto
        form.innerHTML = `
            <h3>Agregar nuevo libro</h3>
            <input type="text" id="nuevoLibroTitulo" placeholder="Título" required>
            <input type="text" id="nuevoLibroAutor" placeholder="Autor" required>
            <input type="number" id="nuevoLibroAño" placeholder="Año" min="1" max="2023" required>
            <button onclick="agregarNuevoLibro()">Agregar Libro</button>
        `;
        
        // Agregar evento al botón para mostrar/ocultar el formulario
        botonAgregar.onclick = function() {
            if (form.style.display === "none") {
                form.style.display = "flex";
                this.textContent = "Cancelar";
            } else {
                form.style.display = "none";
                this.textContent = "Agregar Libro";
            }
        };
        
        // Insertar el botón y el formulario antes de la tabla
        const tabla = document.getElementById("tablaLibros");
        divLibros.insertBefore(botonAgregar, tabla);
        divLibros.insertBefore(form, tabla);
    }
}

function renderUsuarios() {
    // Implementa la lógica para mostrar los usuarios en la tabla
    const tablaBody = document.querySelector("#tablaUsuarios tbody");
    tablaBody.innerHTML = "";
    
    biblioteca.usuarios.forEach(usuario => {
        const fila = document.createElement("tr");
        
        const celdaId = document.createElement("td");
        celdaId.textContent = usuario.id;
        
        const celdaNombre = document.createElement("td");
        celdaNombre.textContent = usuario.nombre;
        
        const celdaEmail = document.createElement("td");
        celdaEmail.textContent = usuario.email;
        
        const celdaLibros = document.createElement("td");
        celdaLibros.textContent = usuario.librosPrestados;
        
        const celdaAcciones = document.createElement("td");
        
        if (usuario.tienePrestamos()) {
            celdaAcciones.textContent = "No disponible";
        } else {
            const botonEliminar = document.createElement("button");
            botonEliminar.textContent = "Eliminar";
            botonEliminar.onclick = function() {
                eliminarUsuario(usuario.id);
            };
            botonEliminar.style.backgroundColor = "#dc3545";
            botonEliminar.style.color = "white";
            
            celdaAcciones.appendChild(botonEliminar);
        }
        
        fila.appendChild(celdaId);
        fila.appendChild(celdaNombre);
        fila.appendChild(celdaEmail);
        fila.appendChild(celdaLibros);
        fila.appendChild(celdaAcciones);
        
        tablaBody.appendChild(fila);
    });
    
    if (!document.getElementById("formNuevoUsuario")) {
        const divUsuarios = document.getElementById("usuarios");
        const form = document.createElement("div");
        form.id = "formNuevoUsuario";
        form.className = "form-group";
        form.innerHTML = `
            <h3>Registrar nuevo usuario</h3>
            <input type="text" id="nuevoUsuarioNombre" placeholder="Nombre" required>
            <input type="email" id="nuevoUsuarioEmail" placeholder="Email" required>
            <button onclick="agregarNuevoUsuario()">Registrar Usuario</button>
        `;
        
        const tabla = document.getElementById("tablaUsuarios");
        divUsuarios.insertBefore(form, tabla);
    }
}

function renderPrestamos() {
    // Implementa la lógica para mostrar los préstamos en la tabla
    const tablaBody = document.querySelector("#tablaPrestamos tbody");
    tablaBody.innerHTML = "";
    
    biblioteca.prestamos.forEach(prestamo => {
        const fila = document.createElement("tr");
        
        const libro = biblioteca.libros.find(l => l.id === prestamo.libroId);
        const usuario = biblioteca.usuarios.find(u => u.id === prestamo.usuarioId);
        
        const celdaId = document.createElement("td");
        celdaId.textContent = prestamo.id;
        
        const celdaLibro = document.createElement("td");
        celdaLibro.textContent = libro ? libro.getInfoLibro() : "Libro no encontrado";
        
        const celdaUsuario = document.createElement("td");
        celdaUsuario.textContent = usuario ? usuario.nombre : "Usuario no encontrado";
        
        const celdaFechaPrestamo = document.createElement("td");
        celdaFechaPrestamo.textContent = formatearFecha(prestamo.fechaPrestamo);
        
        const celdaFechaDevolucion = document.createElement("td");
        celdaFechaDevolucion.textContent = prestamo.fechaDevolucion ? formatearFecha(prestamo.fechaDevolucion) : "-";
        
        const celdaEstado = document.createElement("td");
        celdaEstado.textContent = prestamo.estado;
        
        const celdaAcciones = document.createElement("td");
        
        if (prestamo.estado === "Prestado") {
            const botonDevolver = document.createElement("button");
            botonDevolver.textContent = "Devolver";
            botonDevolver.onclick = function() {
                devolverLibroPrestado(prestamo.id);
            };
            celdaAcciones.appendChild(botonDevolver);
        } else {
            celdaAcciones.textContent = "-";
        }
        
        fila.appendChild(celdaId);
        fila.appendChild(celdaLibro);
        fila.appendChild(celdaUsuario);
        fila.appendChild(celdaFechaPrestamo);
        fila.appendChild(celdaFechaDevolucion);
        fila.appendChild(celdaEstado);
        fila.appendChild(celdaAcciones);
        
        tablaBody.appendChild(fila);
    });
    
    if (!document.getElementById("formNuevoPrestamo")) {
        const divPrestamos = document.getElementById("prestamos");
        const form = document.createElement("div");
        form.id = "formNuevoPrestamo";
        form.className = "form-group";
        form.innerHTML = `
            <h3>Realizar nuevo préstamo</h3>
            <select id="prestamoLibroId">
                <option value="">Seleccionar libro</option>
            </select>
            <select id="prestamoUsuarioId">
                <option value="">Seleccionar usuario</option>
            </select>
            <button onclick="realizarPrestamo()">Realizar Préstamo</button>
        `;
        
        const tabla = document.getElementById("tablaPrestamos");
        divPrestamos.insertBefore(form, tabla);
        
        actualizarOpcionesPrestamo();
    }
}

function formatearFecha(fechaString) {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString();
}

function actualizarOpcionesPrestamo() {
    const selectLibro = document.getElementById("prestamoLibroId");
    const selectUsuario = document.getElementById("prestamoUsuarioId");
    
    selectLibro.innerHTML = '<option value="">Seleccionar libro</option>';
    selectUsuario.innerHTML = '<option value="">Seleccionar usuario</option>';
    
    biblioteca.libros.forEach(libro => {
        if (libro.disponible) {
            const option = document.createElement("option");
            option.value = libro.id;
            option.textContent = libro.getInfoLibro();
            selectLibro.appendChild(option);
        }
    });
    
    biblioteca.usuarios.forEach(usuario => {
        const option = document.createElement("option");
        option.value = usuario.id;
        option.textContent = `${usuario.nombre} (${usuario.email})`;
        selectUsuario.appendChild(option);
    });
}

function agregarNuevoLibro() {
    const titulo = document.getElementById("nuevoLibroTitulo").value.trim();
    const autor = document.getElementById("nuevoLibroAutor").value.trim();
    const año = parseInt(document.getElementById("nuevoLibroAño").value);
    
    if (!titulo || !autor || isNaN(año) || año < 1 || año > new Date().getFullYear()) {
        alert("Por favor, completa todos los campos correctamente.");
        return;
    }
    
    biblioteca.agregarLibro(titulo, autor, año);
    
    document.getElementById("nuevoLibroTitulo").value = "";
    document.getElementById("nuevoLibroAutor").value = "";
    document.getElementById("nuevoLibroAño").value = "";
    
    renderLibros();
    actualizarOpcionesPrestamo();
}

function eliminarLibro(id) {
    const libroIndex = biblioteca.libros.findIndex(l => l.id === id);
    
    if (libroIndex === -1) {
        alert("El libro no existe.");
        return;
    }
    
    const libro = biblioteca.libros[libroIndex];
    if (!libro.disponible) {
        alert("No se puede eliminar un libro que está prestado.");
        return;
    }
    
    if (confirm(`¿Estás seguro de eliminar el libro "${libro.titulo}"?`)) {
        biblioteca.libros.splice(libroIndex, 1);
        renderLibros();
        actualizarOpcionesPrestamo();
    }
}

function agregarNuevoUsuario() {
    const nombre = document.getElementById("nuevoUsuarioNombre").value.trim();
    const email = document.getElementById("nuevoUsuarioEmail").value.trim();
    
    if (!nombre || !email) {
        alert("Por favor, completa todos los campos.");
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Por favor, introduce un email válido.");
        return;
    }
    
    if (biblioteca.usuarios.some(u => u.email === email)) {
        alert("Ya existe un usuario con ese email.");
        return;
    }
    
    biblioteca.agregarUsuario(nombre, email);
    
    document.getElementById("nuevoUsuarioNombre").value = "";
    document.getElementById("nuevoUsuarioEmail").value = "";
    
    renderUsuarios();
    actualizarOpcionesPrestamo();
}

function eliminarUsuario(id) {
    const usuarioIndex = biblioteca.usuarios.findIndex(u => u.id === id);
    
    if (usuarioIndex === -1) {
        alert("El usuario no existe.");
        return;
    }
    
    const usuario = biblioteca.usuarios[usuarioIndex];
    if (usuario.tienePrestamos()) {
        alert("No se puede eliminar un usuario que tiene libros prestados.");
        return;
    }
    
    if (confirm(`¿Estás seguro de eliminar al usuario "${usuario.nombre}"?`)) {
        biblioteca.usuarios.splice(usuarioIndex, 1);
        renderUsuarios();
        actualizarOpcionesPrestamo();
    }
}

function realizarPrestamo() {
    const libroId = parseInt(document.getElementById("prestamoLibroId").value);
    const usuarioId = parseInt(document.getElementById("prestamoUsuarioId").value);
    
    if (isNaN(libroId) || isNaN(usuarioId)) {
        alert("Por favor, selecciona un libro y un usuario.");
        return;
    }
    
    const prestamo = biblioteca.prestarLibro(libroId, usuarioId);
    
    if (prestamo) {
        renderLibros();
        renderUsuarios();
        renderPrestamos();
        actualizarOpcionesPrestamo();
    } else {
        alert("No se pudo realizar el préstamo. Verifica que el libro esté disponible.");
    }
}

function devolverLibroPrestado(prestamoId) {
    const resultado = biblioteca.devolverLibro(prestamoId);
    
    if (resultado) {
        renderLibros();
        renderUsuarios();
        renderPrestamos();
        actualizarOpcionesPrestamo();
    } else {
        alert("No se pudo devolver el libro. El préstamo no existe o ya ha sido devuelto.");
    }
}

// Iniciar la aplicación
window.onload = init;