import { Movimiento } from "./movimiento.model";

export class Mov_renglon {
    
    constructor(
        public estado: Array<string>,
        public movimiento: Movimiento,
        public etiq: number,
        public nom_empresa: String,
        public num_etiqueta: String,
        public lote: String
    ) { }
      
}

