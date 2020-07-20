
export class Lote {
    
    constructor(
        public cantidad: number,
        public id_empresa: string,
        public tipo: string,
        public id_usuario_alta?: string,
        public fecha_alta?: string,
        public id_usuario_baja?: string,
        public fecha_baja?: string,
        public numero?: number,
        public _id?: string
    ) { }

}

