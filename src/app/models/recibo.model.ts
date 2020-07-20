import { Renglon } from "./renglon.model";

export class Recibo {
    
    constructor(
        public nombre_empresa: string,
        public email: string,
        public envio: string,
        public fecha: string,
        public renglones: Array<Renglon>,
        public firma_nombre: string,
        public firma_apellido: string,
        public firma?: Blob,
        public telefono?: string,
        public responsable?: string,
        public direccion?: string,
        public razon_social?: string,
        public id_empresa?: string,
        public observaciones?: string,
        public enviar_email?: boolean,
        public usuario_creacion?: string,
        public _id?: string,
        public fecha_baja?: string,
        public usuario_baja?: string,
    ) { }

}

