import { GestorDatos } from '../datos/GestorDatos.js';

document.addEventListener('DOMContentLoaded', () => {
    GestorDatos.inicializar();
    renderizarListado();
});

function renderizarListado() {
    const tbody = document.querySelector('#tabla-listado tbody');
    tbody.innerHTML = '';

    const peliculas = GestorDatos.obtenerPeliculas();
    const generosRef = GestorDatos.obtenerGeneros();

    peliculas.forEach(p => {
        const nombresGeneros = p.generos.map(id => {
            const g = generosRef.find(gen => gen.id === id);
            return g ? g.nombre : '?';
        }).join(', ');

        const tr = document.createElement('tr');
        // Mostrar media en tiempo real 
        tr.innerHTML = `
            <td>${p.titulo}</td>
            <td>${p.fechaEstreno}</td>
            <td>${p.popularidad}</td>
            <td style="font-weight:bold; font-size:1.2em">${p.puntuacionMedia}</td>
            <td>${p.numeroVotos}</td>
            <td>${nombresGeneros}</td>
            <td>
                <button class="btn-votar" data-id="${p.id}">Votar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Evento Votar 
    document.querySelectorAll('.btn-votar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            const input = prompt("Introduce tu voto (0-10):");

            if (input !== null) {
                const voto = parseInt(input);
                if (!isNaN(voto) && voto >= 0 && voto <= 10) {
                    GestorDatos.votarPelicula(id, voto);
                    renderizarListado(); // Refrescar lista completa
                } else {
                    alert("Por favor, introduce un número entero entre 0 y 10.");
                }
            }
        });
    });
}