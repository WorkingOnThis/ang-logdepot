
export class Usuario {

    constructor(
        public nombre: string,
        public apellido: string,
        public email: string,
        public id_empresa: string,
        public password: string,
        public role: string,
        public img?: string,
        public id_creador?: string,
        public fecha_creacion?: string,
        public cargo?: string,
        public telefono?: string,
        public dni?: string,
        public cuit?: string,
        public direccion?: string,
        public observaciones?: string,
        public id_usuario_baja?: string,
        public fecha_baja?: string,
        public _id?: string
    ) { }

}


