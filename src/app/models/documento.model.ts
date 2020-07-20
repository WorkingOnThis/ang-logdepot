
export class Documento {

    constructor(
        public id_caja: string,
        public id_codigo: string,
        public id_solicitud?: string,
        public id_usuario_alta?: string,
        public fecha_alta?: string,
        public id_usuario_baja?: string,
        public fecha_baja?: string,
        public prestamo?: string,
        public _id?: string
    ) { }

}


