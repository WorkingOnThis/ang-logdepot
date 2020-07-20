
export class Movimiento {

    constructor(
        public codigo: string,
        public accion: number,
        public tipo_prod: string,
        public asociacion?: string,
        public observacion?: string,
        public id_usuario_alta?: string,
        public fecha_alta?: string,
        public id_usuario_baja?: string,
        public fecha_baja?: string,
        public _id?: string
    ) { }

}


