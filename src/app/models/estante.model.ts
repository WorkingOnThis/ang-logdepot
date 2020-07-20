
export class Estante {
    
    constructor(
        public deposito: string,
        public nombre: string,
        public posicion: number,
        public filas: number,
        public columnas: number,
        public usuario?: string,
        public _id?: string,
        public fecha?: string
    ) { }

}

