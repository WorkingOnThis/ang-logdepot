import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {

  constructor(
    public http: HttpClient
  ) { }

  crearEstado( formulario: any ){

    const URL = URL_SERVICIOS + '/estados';

    return this.http.post( URL , formulario );
  }

  obtenerEstados(){

    const URL = URL_SERVICIOS + '/estados';

    return this.http.get( URL );
  }

  obtenerEstadosCaja(){

    const URL = URL_SERVICIOS + '/estados/caja' ;

    return this.http.get( URL );
  }

  obtenerEstadosTipo( tipo: string ){

    const URL = URL_SERVICIOS + '/estados/tipo/' + tipo ;

    return this.http.get( URL );
  }
}
