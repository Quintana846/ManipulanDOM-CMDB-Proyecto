/**
 * Clase que representa un Género de película.
 * Cumple con los requisitos de la Unidad 3 sobre Clases y JSDoc.
 */
export class Genero {
    /**
     * @param {number} id - Identificador único (Entero positivo, solo lectura).
     * @param {string} nombre - Nombre del género (Máx 100 caracteres).
     */
    constructor(id, nombre) {
        this._id = id;
        this._nombre = nombre;
    }

    /**
     * Obtiene el ID del género.
     * @returns {number}
     */
    get id() { return this._id; }

    /**
     * Obtiene el nombre del género.
     * @returns {string}
     */
    get nombre() { return this._nombre; }

    /**
     * Establece el nombre del género.
     * @param {string} valor
     */
    set nombre(valor) { 
        if(valor && valor.length <= 100) {
            this._nombre = valor; 
        } else {
            throw new Error("El nombre no puede estar vacío ni superar 100 caracteres.");
        }
    }

    /**
     * Convierte el objeto a un formato JSON simple para almacenamiento.
     */
    toJSON() {
        return { id: this._id, nombre: this._nombre };
    }
}