import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Recibo } from 'src/app/models/recibo.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ReciboModificado } from 'src/app/models/recibomodificado.model';

@Injectable({
  providedIn: 'root'
})
export class ReciboService {

  constructor(
    public http: HttpClient
  ) { }

  crearRecibo( recibo: Recibo ) {

    const URL = URL_SERVICIOS + '/recibo';

    return this.http.post( URL , recibo );

  }

  obtenerRecibos() {

    const URL = URL_SERVICIOS + '/recibo';

    return this.http.get( URL ).pipe(
      map( (resp:any) => resp.recibos) );

  }

  obtenerRecibo( id: string) {

    const URL = URL_SERVICIOS + '/recibo/' + id

    return this.http.get( URL ).pipe(
      map( (resp:any) => resp.recibo) );

  }

  
  anularRecibo( recibo: Recibo ){
    
    let url = URL_SERVICIOS + '/recibo/anular/' + recibo._id; 
    
    return this.http.put( url, recibo );
  }

  desanularRecibo( id: string ){

    let url = URL_SERVICIOS + '/recibo/desanular/' + id; 
    
    return this.http.put( url, id );
  }
  
  // Debo de eliminar los renglones que le corresponden.
  eliminarRecibo( id: string ){
    
    let url = URL_SERVICIOS + '/recibo/' + id; 
    
    return this.http.delete( url );
  }

  obtenerRenglones( id: string) {

    const URL = URL_SERVICIOS + '/recibo/renglones/' + id

    return this.http.get( URL ).pipe(
      map( (resp:any) => resp.renglones) );

  }

  actualizarRenglon( id: string, body: ReciboModificado) {

    const URL = URL_SERVICIOS + '/recibo/' + id

    return this.http.put( URL, body );

  }
  
}
