/**
 * Clase que representa una Película.
 */
export class Pelicula {
    /**
     * @param {number} id - Identificador único.
     * @param {string} titulo - Título de la película.
     * @param {string} fechaEstreno - Fecha formato YYYY-MM-DD.
     * @param {number} popularidad - Entero o decimal (0-100).
     * @param {Array<number>} puntuaciones - Array de votos (0-10).
     * @param {Array<number>} generos - Array de IDs de géneros.
     */

    constructor(id, titulo, fechaEstreno, popularidad, puntuaciones = [], generos = []) {
        this._id = id;
        this._titulo = titulo;
        this._fechaEstreno = fechaEstreno;
        this._popularidad = popularidad;
        this._puntuaciones = puntuaciones;
        this._generos = generos;
    }

    get id() { 
        return this._id; 
    }

    get titulo() { 
        return this._titulo; 
    }

    set titulo(valor) { 
        if(valor && valor.length <= 100) {
            this._titulo = valor; 
        }
    }

    get fechaEstreno() { 
        return this._fechaEstreno;
     }

    set fechaEstreno(valor) {
         this._fechaEstreno = valor; 
        }

    get popularidad() { 
        return this._popularidad; 
    }
    set popularidad(valor) {
        if(valor >= 0 && valor <= 100) {
            this._popularidad = valor;
        }
    }

    get generos() { 
        return this._generos; 
    }
    set generos(valor) { 
        this._generos = valor; 
    }

    /**
     * Calcula la media de las puntuaciones a tiempo real 
     * @returns {string} - Media con 1 decimal o "0.0".
     */
    get puntuacionMedia() {
        if (this._puntuaciones.length === 0) {
            return "0.0";
        } else {
        const suma = this._puntuaciones.reduce((total, puntuacion) => total + puntuacion, 0);
        return (suma / this._puntuaciones.length).toFixed(1); //para decimales
        }
    }
    /**
     * Devuelve el número total de votos.
     * @returns {number}
     */
    get numeroVotos() { 
        return this._puntuaciones.length; 
    }

    /**
     * Añade un voto al array.
     * @param {number} voto - Valor entre 0 y 10.
     */
    agregarVoto(voto) {
        if (voto >= 0 && voto <= 10) {
            this._puntuaciones.push(voto);
        }
    }

    toJSON() {
        return {
            id: this._id,
            titulo: this._titulo,
            fechaEstreno: this._fechaEstreno,
            popularidad: this._popularidad,
            puntuaciones: this._puntuaciones,
            generos: this._generos
        };
    }
}