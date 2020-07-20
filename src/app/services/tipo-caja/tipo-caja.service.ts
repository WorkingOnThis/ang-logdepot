import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class TipoCajaService {

  constructor(
    public http: HttpClient
  ) { }

  crearTipoCaja( formulario: any ){

    const URL = URL_SERVICIOS + '/tipocaja';

    return this.http.post( URL , formulario );
  }

  obtenerTiposCaja(){

    const URL = URL_SERVICIOS + '/tipocaja';

    return this.http.get( URL );
  }
}
