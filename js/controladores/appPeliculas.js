import { GestorDatos } from '../datos/GestorDatos.js';

document.addEventListener('DOMContentLoaded', () => {
    GestorDatos.inicializar();
    cargarSelectGeneros();
    pintarTabla();

    // Validar y Crear Película

    document.getElementById('form-pelicula').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const titulo = document.getElementById('titulo').value.trim();
        const fecha = document.getElementById('fecha').value;
        const popularidad = parseFloat(document.getElementById('popularidad').value);
        
        // Recoger géneros seleccionados 

        const checkboxes = document.querySelectorAll('input[name="genero"]:checked'); //recoge los valores donde el check está activado
        const generosIds = Array.from(checkboxes).map(check => parseInt(check.value));

        // otra manera seria: 
        // const generosIds = [].map.call(checkboxes, function (check){ return check.value});

        // --- VALIDACIONES DEL ENUNCIADO ---

        const fechaObj = new Date(fecha);
        const fechaMinima = new Date("1900-01-01");
        const fechaHoy = new Date();

        let errores = [];

        if (fechaObj < fechaMinima || fechaObj > fechaHoy) {
            errores.push("La fecha debe ser posterior a 1/1/1900 y no puede ser futura.");
        }

        if (isNaN(popularidad) || popularidad < 0 || popularidad > 100) {
            errores.push("La popularidad debe estar entre 0 y 100.");
        }

        if (generosIds.length === 0) {
            errores.push("Debes seleccionar al menos un género.");
        }

        if (errores.length > 0) {
            alert(errores.join('\n'));
            return;
        }

        GestorDatos.crearPelicula(titulo, fecha, popularidad, generosIds);
        pintarTabla();
        e.target.reset(); 
        alert("Película creada.");
    });
});

function cargarSelectGeneros() {
    const contenedor = document.getElementById('contenedor-generos');
    const generos = GestorDatos.obtenerGeneros();
    contenedor.innerHTML = '';

    generos.forEach(g => {
        const label = document.createElement('label');
        label.style.marginRight = "10px";
        label.innerHTML = `
            <input type="checkbox" name="genero" value="${g.id}"> ${g.nombre}
        `;
        contenedor.appendChild(label);
    });
}

function pintarTabla() {
    const tbody = document.querySelector('#tabla-peliculas tbody');
    tbody.innerHTML = '';
    
    const peliculas = GestorDatos.obtenerPeliculas();
    const generosRef = GestorDatos.obtenerGeneros();

    peliculas.forEach(p => {

        // Mapear IDs de géneros a Nombres
        
        const nombresGeneros = p.generos.map(id => {
            const g = generosRef.find(gen => gen.id === id);
            return g ? g.nombre : 'Desconocido';
        }).join(', ');

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.id}</td>
            <td>${p.titulo}</td>
            <td>${p.fechaEstreno}</td>
            <td>${p.popularidad}</td>
            <td>${nombresGeneros}</td>
            <td>
                <button class="eliminar" data-id="${p.id}">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    document.querySelectorAll('.eliminar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if(confirm("¿Seguro que quieres borrar esta película?")) {
                GestorDatos.eliminarPelicula(parseInt(e.target.dataset.id));
                pintarTabla();
            }
        });
    });
}