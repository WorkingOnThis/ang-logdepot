import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MovimientosService {

  constructor(
    public http: HttpClient
  ) { }

  agregarMovimientoECE0( arrayMovimientos: any ) {

    const URL = URL_SERVICIOS + '/movimiento/entrada/caja/etiquetac';

    return this.http.post( URL , arrayMovimientos );

  }

  agregarMovimientoECE1( arrayMovimientos: any ) {

    const URL = URL_SERVICIOS + '/movimiento/entrada/caja/etiquetau';

    return this.http.post( URL , arrayMovimientos );

  }

  agregarMovimientoED( arrayMovimientos: any ) {

    const URL = URL_SERVICIOS + '/movimiento/entrada/documento';

    return this.http.post( URL , arrayMovimientos );

  }

  agregarMovimientoSC( arrayMovimientos: any ) {

    const URL = URL_SERVICIOS + '/movimiento/salida/caja';

    return this.http.post( URL , arrayMovimientos );

  }

  agregarMovimientoSD( arrayMovimientos: any ) {

    const URL = URL_SERVICIOS + '/movimiento/salida/documento';

    return this.http.post( URL , arrayMovimientos );

  }

  cargarMovimientos(){

    const url = URL_SERVICIOS + '/movimiento'; 
    
    return this.http.get( url ).pipe(
      map( (resp:any) => resp.movimientos) );

  }

}
