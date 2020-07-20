
export class Contenido_vista {
    
    constructor(
        public txt_contenido: string,
        public id_area?: string,
        public id_tipo?: string,
        public nombre_area?: string,
        public nombre_tipo?: string,
        public desde_n?: string,
        public hasta_n?: string,
        public desde_fecha?: string,
        public hasta_fecha?: string,
        public desde_letra?: string,
        public hasta_letra?: string,
        public observacion?: string,
        public id_caja?: string,
        public _id?: string
    ) { }

    // public txt_contenido: string,
    // public nombre_area?: string,
    // public nombre_tipo?: string,
    // public desde_n?: string,
    // public hasta_n?: string,
    // public desde_fecha?: string,
    // public hasta_fecha?: string,
    // public desde_letra?: string,
    // public hasta_letra?: string,
    // public observacion?: string,
    // public _id?: string

    // 'SELECT co.txt_contenido, ta.nombre, td.nombre, co.desde_n, co.hasta_n, co.desde_fecha, co.hasta_fecha, co.desde_letra, co.hasta_letra, co.observacion, co._id ' +
    // 'FROM contenidos as co ' +
    // 'LEFT JOIN areas as ta ON ta._id = co.id_area ' +
    // 'LEFT JOIN tipos_documento as td ON td._id = co.id_tipo ' +
    // 'WHERE co.id_caja = ?';
}

