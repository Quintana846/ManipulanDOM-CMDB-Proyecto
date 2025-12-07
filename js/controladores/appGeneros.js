import { GestorDatos } from '../datos/GestorDatos.js';

document.addEventListener('DOMContentLoaded', () => {
    GestorDatos.inicializar(); // Cargar datos iniciales
    pintarTabla();

    // Evento Formulario Alta
    document.getElementById('form-genero').addEventListener('submit', (e) => {
        e.preventDefault();
        const inputNombre = document.getElementById('nombreGenero');
        const nombre = inputNombre.value.trim();

        if (nombre) {
            try {
                GestorDatos.crearGenero(nombre);
                inputNombre.value = '';
                pintarTabla();
                alert("Género creado correctamente.");
            } catch (error) {
                alert("Error: " + error.message);
            }
        }
    });
});

function pintarTabla() {
    const tabla = document.querySelector('#tabla-generos tbody');
    tabla.innerHTML = '';

    const generos = GestorDatos.obtenerGeneros();

    generos.forEach(g => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${g.id}</td>
            <td>${g.nombre}</td>
            <td>
                <button class="eliminar" data-id="${g.id}">Eliminar</button>
            </td>
        `;
        tabla.appendChild(tr);
    });

    const botonesEliminar = document.querySelectorAll('.eliminar');
    botonesEliminar.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            try {
                GestorDatos.eliminarGenero(id);
                pintarTabla();
            } catch (err) {
                alert(err.message); // Mostrar error si hay películas asociadas
            }
        });
    });
}