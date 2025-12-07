import { Genero } from '../modelos/Genero.js';
import { Pelicula } from '../modelos/Pelicula.js';

/**
 * Módulo Singleton para gestionar LocalStorage y la lógica de datos.
 * Cumple requisito 4.4 de Persistencia.
 */
export const GestorDatos = {
    localGeneros: 'cmdb_generos',
    localPelis: 'cmdb_peliculas',

    /**
     * Carga inicial de datos si no existen (5 pelis, 2 generos).
     */
    inicializar() {
        if (!localStorage.getItem(this.localGeneros)) {
            const generosCreados = [
                new Genero(1, "Ciencia Ficción"),
                new Genero(2, "Drama")
            ];
            this.guardarGeneros(generosCreados);
        }

        if (!localStorage.getItem(this.localPelis)) {
            const pelisCreadas = [
                new Pelicula(1, "Blade Runner", "1982-06-25", 90, [10, 9], [1]),
                new Pelicula(2, "El Padrino", "1972-03-14", 95, [10, 10, 9], [2]),
                new Pelicula(3, "Matrix", "1999-03-31", 88, [8, 9], [1]),
                new Pelicula(4, "Interstellar", "2014-11-07", 92, [9, 10], [1, 2]),
                new Pelicula(5, "Cadena Perpetua", "1994-09-23", 93, [10], [2])
            ];
            this.guardarPeliculas(pelisCreadas);
        }
    },

    // --- MÉTODOS DE GÉNEROS ---

    obtenerGeneros() {
        try {
            const json = localStorage.getItem(this.localGeneros);
            return json ? JSON.parse(json).map(g => new Genero(g.id, g.nombre)) : [];
        } catch (e) {
            console.error("Error datos géneros, reiniciando...", e);
            localStorage.removeItem(this.localGeneros);
            return [];
        }
    },

    guardarGeneros(lista) {
        const json = lista.map(g => g.toJSON());
        localStorage.setItem(this.localGeneros, JSON.stringify(json));
    },

    /**
     * Obtiene el último ID y suma 1
     */
    nuevoIdGenero() {
        const generos = this.obtenerGeneros();
        if (generos.length === 0) return 1;
        const maxId = generos.reduce((max, g) => (g.id > max ? g.id : max), 0);
        return maxId + 1;
    },

    crearGenero(nombre) {
        const lista = this.obtenerGeneros();
        const genero = new Genero(this.nuevoIdGenero(), nombre);
        lista.push(genero);
        this.guardarGeneros(lista);
    },

    /**
     * Elimina género comprobando integridad referencial.
     */
    eliminarGenero(id) {
        const peliculas = this.obtenerPeliculas();
        // Comprobar si alguna película tiene este género (uso de some)
        const enUso = peliculas.some(p => p.generos.includes(id));

        if (enUso) {
            throw new Error("No se puede eliminar: El género está asignado a una o más películas.");
        }

        const lista = this.obtenerGeneros().filter(g => g.id !== id);
        this.guardarGeneros(lista);
    },

    // --- MÉTODOS DE PELÍCULAS ---

    obtenerPeliculas() {
        try {
            const json = localStorage.getItem(this.localPelis);
            return json ? JSON.parse(json).map(p => new Pelicula(p.id, p.titulo, p.fechaEstreno, p.popularidad, p.puntuaciones, p.generos)) : [];
        } catch (e) {
            console.error("Error datos películas, reiniciando...", e);
            localStorage.removeItem(this.localPelis);
            return [];
        }
    },

    guardarPeliculas(lista) {
        const json = lista.map(p => p.toJSON());
        localStorage.setItem(this.localPelis, JSON.stringify(json));
    },

    nuevoIdPelicula() {
        const pelis = this.obtenerPeliculas();
        if (pelis.length === 0) return 1;
        const maxId = pelis.reduce((max, p) => (p.id > max ? p.id : max), 0);
        return maxId + 1;
    },

    crearPelicula(titulo, fecha, popularidad, generosIds) {
        const lista = this.obtenerPeliculas();
        const maxId = lista.reduce((max, p) => Math.max(max, p.id), 0);
        const nueva = new Pelicula(maxId + 1, titulo, fecha, popularidad, [], generosIds);
        lista.push(nueva);
        this.guardarPeliculas(lista);
    },

    eliminarPelicula(id) {
        const lista = this.obtenerPeliculas().filter(p => p.id !== id);
        this.guardarPeliculas(lista);
    },

    votarPelicula(id, voto) {
        const lista = this.obtenerPeliculas();
        const peli = lista.find(p => p.id === id);
        if (peli) {
            peli.agregarVoto(voto);
            this.guardarPeliculas(lista);
        }
    }
};