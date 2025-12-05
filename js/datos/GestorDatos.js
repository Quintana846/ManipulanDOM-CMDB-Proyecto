import { Genero } from '../modelos/Genero.js';
import { Pelicula } from '../modelos/Pelicula.js';

/**
 * Módulo Singleton para gestionar LocalStorage y la lógica de datos.
 * Cumple requisito 4.4 de Persistencia.
 */
export const GestorDatos = {
    KEY_GENEROS: 'cmdb_generos',
    KEY_PELICULAS: 'cmdb_peliculas',

    /**
     * Carga inicial de datos si no existen (5 pelis, 2 generos).
     */
    inicializar() {
        if (!localStorage.getItem(this.KEY_GENEROS)) {
            const generosInit = [
                new Genero(1, "Ciencia Ficción"),
                new Genero(2, "Drama")
            ];
            this.guardarGeneros(generosInit);
        }

        if (!localStorage.getItem(this.KEY_PELICULAS)) {
            const pelisInit = [
                new Pelicula(1, "Blade Runner", "1982-06-25", 90, [10, 9], [1]),
                new Pelicula(2, "El Padrino", "1972-03-14", 95, [10, 10, 9], [2]),
                new Pelicula(3, "Matrix", "1999-03-31", 88, [8, 9], [1]),
                new Pelicula(4, "Interstellar", "2014-11-07", 92, [9, 10], [1, 2]),
                new Pelicula(5, "Cadena Perpetua", "1994-09-23", 93, [10], [2])
            ];
            this.guardarPeliculas(pelisInit);
        }
    },

    // --- MÉTODOS DE GÉNEROS ---

    obtenerGeneros() {
        const json = localStorage.getItem(this.KEY_GENEROS);
        if (!json) return [];
        return JSON.parse(json).map(g => new Genero(g.id, g.nombre));
    },

    guardarGeneros(lista) {
        const json = lista.map(g => g.toJSON());
        localStorage.setItem(this.KEY_GENEROS, JSON.stringify(json));
    },

    /**
     * Obtiene el último ID y suma 1[cite: 22].
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
     * Elimina género comprobando integridad referencial[cite: 47].
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
        const json = localStorage.getItem(this.KEY_PELICULAS);
        if (!json) return [];
        return JSON.parse(json).map(p => 
            new Pelicula(p.id, p.titulo, p.fechaEstreno, p.popularidad, p.puntuaciones, p.generos)
        );
    },

    guardarPeliculas(lista) {
        const json = lista.map(p => p.toJSON());
        localStorage.setItem(this.KEY_PELICULAS, JSON.stringify(json));
    },

    nuevoIdPelicula() {
        const pelis = this.obtenerPeliculas();
        if (pelis.length === 0) return 1;
        const maxId = pelis.reduce((max, p) => (p.id > max ? p.id : max), 0);
        return maxId + 1;
    },

    crearPelicula(titulo, fecha, popularidad, generosIds) {
        const lista = this.obtenerPeliculas();
        const nueva = new Pelicula(
            this.nuevoIdPelicula(),
            titulo,
            fecha,
            popularidad,
            [], // Puntuaciones vacías al inicio
            generosIds
        );
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